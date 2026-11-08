export type TaxYear = 2024 | 2025 | 2026;
export type ProvinceCode = 'AB' | 'BC' | 'MB' | 'NB' | 'NL' | 'NS' | 'ON' | 'PE' | 'QC' | 'SK';
export type TerritoryCode = 'NT' | 'NU' | 'YT';
export type PersonType = 'employee' | 'soleProprietor' | 'corporation';

export interface TaxBracket {
  label: string;
  start: number;
  rate: number;
}

export interface Jurisdiction {
  name: string;
  brackets: TaxBracket[];
  bpa?: number;
}

export interface RateTable {
  taxYear: TaxYear;
  federal: Jurisdiction;
  provinces: Record<ProvinceCode, Jurisdiction>;
  territories: Record<TerritoryCode, Jurisdiction>;
  quebec: Jurisdiction;
  qpba: number;
}

export interface TaxResult {
  gross: number;
  taxable: number;
  brackets: { label: string; amount: number; tax: number }[];
  tax: number;
}

/** Tax application rate (total tax / gross income), expressed as a percentage. */
export interface TaxRate {
  federalRate: number;
  provincialRate: number;
  totalRate: number;
}

export interface EmployeeTaxResult {
  gross: number;
  cpp: number;
  ei: number;
  federalTax: number;
  provincialTax: number;
  totalIncomeTax: number;
  netPay: number;
  breakdown: TaxResult[];
  /** Effective federal tax rate (percentage). */
  federalRate: number;
  /** Effective provincial tax rate (percentage). */
  provincialRate: number;
  /** Effective total income tax rate (percentage). */
  totalRate: number;
}

export interface SoleProprietorResult {
  revenue: number;
  expenses: number;
  businessNetIncome: number;
  cpp: number;
  ei: number;
  federalTax: number;
  provincialTax: number;
  totalIncomeTax: number;
  estQuarterly: number[];
  /** Effective total income tax rate (percentage). */
  totalRate: number;
}

export interface CorporateResult {
  taxableIncome: number;
  federalTax: number;
  provincialTax: number;
  total: number;
  amtArefundable: number;
  effectiveRate: number;
}

export interface ProvinceComparison {
  province: ProvinceCode;
  label: string;
  netPay: number;
  totalTax: number;
}

export interface EmployeeTaxInput {
  grossIncome: number;
  province: ProvinceCode;
}

export interface SoleProprietorInput {
  revenue: number;
  expenses: number;
  province: ProvinceCode;
  claimCpp?: boolean;
}

export interface CorporateInput {
  taxableIncome: number;
  province: ProvinceCode;
}
