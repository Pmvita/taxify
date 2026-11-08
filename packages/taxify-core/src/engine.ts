import type {
  TaxYear,
  ProvinceCode,
  RateTable,
  TaxResult,
  EmployeeTaxResult,
  EmployeeTaxInput,
  SoleProprietorInput,
  SoleProprietorResult,
  CorporateInput,
  CorporateResult,
  ProvinceComparison,
} from './types';
import { rateTables } from '../data/ca-tax-brackets';

// 2025 payroll inputs (employee side), sourced from CRA (T4032 guide).
const CPP_YMPE = 71300;
const CPP_BASIC_EXEMPTION = 3500;
const CPP_BASE_RATE = 0.0495;
const CPP_SECOND_ADDTIONAL_RATE = 0.04;
const CPP_SECOND_ADDITIONAL_CEILING = 81200; // YAMPE
const CPP_FIRST_ADDTIONAL_RATE = 0.01;
const CPP_FIRST_ADDITIONAL_CEILING = 149000; // YAMPE $81,200 + AMPE $67,800
const EI_INSURABLE = 65700;
const EI_RATE = 0.0164;
const EI_MAX_PREMIUM = 1077.48;

function calcProgressive(brackets: RateTable['federal']['brackets'], income: number): TaxResult {
  const taxable = Math.max(0, income);
  const out: TaxResult['brackets'] = [];
  let tax = 0;
  for (let i = 0; i < brackets.length; i++) {
    const b = brackets[i];
    if (b === undefined) continue;
    // Each bracket covers [prevStart, upper). "start" of a non-final bracket is
    // the boundary where the rate changes; the final bracket is unbounded.
    const upper = i === brackets.length - 1 ? Infinity : b.start;
    const prevStart = i === 0 ? 0 : brackets[i - 1]!.start;
    const slice = Math.max(0, Math.min(taxable, upper) - prevStart);
    if (slice <= 0) continue;
    const t = slice * b.rate;
    tax += t;
    out.push({ label: b.label, amount: slice, tax: t });
  }
  return { gross: income, taxable, brackets: out, tax };
}

export function getRateTable(taxYear: TaxYear): RateTable {
  return rateTables[taxYear] ?? rateTables[2025];
}

/** Non-refundable personal amount credit = BPA × that jurisdiction's lowest rate. */
function personalAmountCredit(bpa: number | undefined, brackets: RateTable['federal']['brackets']): number {
  const lowestRate = brackets[0]?.rate ?? 0;
  return (bpa ?? 0) * lowestRate;
}

/** Quebec residents receive a 16.5% abatement on basic federal tax. */
const QUEBEC_FEDERAL_ABATEMENT = 0.165;

export function federalTax(table: RateTable, income: number): TaxResult {
  return calcProgressive(table.federal.brackets, income);
}

export function federalNetTax(table: RateTable, income: number, province?: ProvinceCode): number {
  const gross = federalTax(table, income).tax;
  const credit = personalAmountCredit(table.federal.bpa, table.federal.brackets);
  let net = Math.max(0, gross - credit);
  if (province === 'QC') {
    net = Math.max(0, net * (1 - QUEBEC_FEDERAL_ABATEMENT));
  }
  return net;
}

export function provincialTax(table: RateTable, province: ProvinceCode, income: number): number {
  if (province === 'QC') return quebecTax(table, income);
  const j = table.provinces[province];
  if (!j) return 0;
  return calcProgressive(j.brackets, income).tax;
}

export function provincialNetTax(table: RateTable, province: ProvinceCode, income: number): number {
  if (province === 'QC') return quebecNetTax(table, income);
  const j = table.provinces[province];
  if (!j) return 0;
  const credit = personalAmountCredit(j.bpa, j.brackets);
  return Math.max(0, provincialTax(table, province, income) - credit);
}

export function quebecTax(table: RateTable, income: number): number {
  return calcProgressive(table.quebec.brackets, income).tax;
}

export function quebecNetTax(table: RateTable, income: number): number {
  const credit = personalAmountCredit(table.qpba, table.quebec.brackets);
  return Math.max(0, quebecTax(table, income) - credit);
}

export function cppEmployee(income: number): number {
  const base = Math.max(0, Math.min(income, CPP_YMPE) - CPP_BASIC_EXEMPTION) * CPP_BASE_RATE;
  const secAdd = Math.max(0, Math.min(income, CPP_SECOND_ADDITIONAL_CEILING) - CPP_YMPE) * CPP_SECOND_ADDTIONAL_RATE;
  const firstAdd = Math.max(0, Math.min(income, CPP_FIRST_ADDITIONAL_CEILING) - CPP_SECOND_ADDITIONAL_CEILING) * CPP_FIRST_ADDTIONAL_RATE;
  return Math.round((base + secAdd + firstAdd) * 100) / 100;
}

export function eiEmployee(income: number): number {
  const calc = Math.min(income, EI_INSURABLE) * EI_RATE;
  return Math.min(calc, EI_MAX_PREMIUM);
}

export function calculateEmployeeTax(table: RateTable, input: EmployeeTaxInput): EmployeeTaxResult {
  const { grossIncome, province } = input;
  const cpp = cppEmployee(grossIncome);
  const ei = eiEmployee(grossIncome);
  const federalTaxCalc = federalNetTax(table, grossIncome, province);
  const provincialTaxCalc = provincialNetTax(table, province, grossIncome);
  const totalIncomeTax = federalTaxCalc + provincialTaxCalc;
  const netPay = grossIncome - cpp - ei - totalIncomeTax;
  const federalResult = federalTax(table, grossIncome);
  const provincialBrackets =
    province === 'QC' ? table.quebec.brackets : table.provinces[province].brackets;
  const provincialResult = calcProgressive(provincialBrackets, grossIncome);
  const federalRate = grossIncome > 0 ? (federalTaxCalc / grossIncome) * 100 : 0;
  const provincialRate = grossIncome > 0 ? (provincialTaxCalc / grossIncome) * 100 : 0;
  const totalRate = grossIncome > 0 ? (totalIncomeTax / grossIncome) * 100 : 0;
  return { gross: grossIncome, cpp, ei, federalTax: federalTaxCalc, provincialTax: provincialTaxCalc, totalIncomeTax, netPay, breakdown: [federalResult, provincialResult], federalRate, provincialRate, totalRate };
}

export function calculateSoleProprietorTax(table: RateTable, input: SoleProprietorInput): SoleProprietorResult {
  const { revenue, expenses, province, claimCpp = true } = input;
  const businessNetIncome = Math.max(0, revenue - expenses);
  const cpp = claimCpp ? cppEmployee(businessNetIncome) : 0;
  const ei = claimCpp ? eiEmployee(businessNetIncome) : 0;
  const federalTaxCalc = federalNetTax(table, businessNetIncome, province);
  const provincialTaxCalc = provincialNetTax(table, province, businessNetIncome);
  const totalIncomeTax = federalTaxCalc + provincialTaxCalc;
  const estQuarterly = [totalIncomeTax / 4, totalIncomeTax / 4, totalIncomeTax / 4, totalIncomeTax / 4];
  const totalRate = businessNetIncome > 0 ? (totalIncomeTax / businessNetIncome) * 100 : 0;
  return { revenue, expenses, businessNetIncome, cpp, ei, federalTax: federalTaxCalc, provincialTax: provincialTaxCalc, totalIncomeTax, estQuarterly, totalRate };
}

export function calculateCorporateTax(table: RateTable, input: CorporateInput): CorporateResult {
  const { taxableIncome, province } = input;
  const federalTaxCalc = federalNetTax(table, taxableIncome, province);
  const provincialTaxCalc = provincialNetTax(table, province, taxableIncome);
  const total = federalTaxCalc + provincialTaxCalc;
  const amtArefundable = taxableIncome * 0.2;
  const effectiveRate = taxableIncome > 0 ? total / taxableIncome : 0;
  return { taxableIncome, federalTax: federalTaxCalc, provincialTax: provincialTaxCalc, total, amtArefundable, effectiveRate };
}

export function compareProvinces(table: RateTable, input: { type: 'employee' | 'soleProprietor' | 'corporation', value: number, province: ProvinceCode }): ProvinceComparison[] {
  const { type, value, province } = input;
  const provinces = Object.keys(table.provinces) as ProvinceCode[];
  return provinces.map((p) => {
      const label = table.provinces[p].name;
      let netPay = 0;
      let totalTax = 0;
      if (type === 'employee') {
        const r = calculateEmployeeTax(table, { grossIncome: value, province: p });
        netPay = r.netPay; totalTax = r.totalIncomeTax;
      } else if (type === 'soleProprietor') {
        const r = calculateSoleProprietorTax(table, { revenue: value, expenses: 0, province: p });
        netPay = -r.totalIncomeTax; totalTax = r.totalIncomeTax;
      } else {
        const r = calculateCorporateTax(table, { taxableIncome: value, province: p });
        netPay = -r.total; totalTax = r.total;
      }
      return { province: p, label, netPay, totalTax };
    })
    .sort((a, b) => b.netPay - a.netPay);
}
