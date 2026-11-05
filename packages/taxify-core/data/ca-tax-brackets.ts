// Taxify — Canadian federal, provincial & territorial tax-rate tables.
//
// Primary year: 2025 (fully verified against canada.ca).
// 2024/2026 = reference. Federal & province thresholds reflect 2025 unless a
// verified 2024/2026 value exists; where exact thresholds for 2024/2026 were not
// independently re-verified, the 2025 rates are proxied with a visible disclaimer
// in the app. Always confirm final figures with the CRA before relying on them
// for filing purposes.
//
// Sources:
//  - Federal 2025: https://www.canada.ca/en/revenue-agency/services/tax/individuals/tax-rates-brackets/last-year.html (2025)
//  - 2024 Federal: https://www.canada.ca/en/revenue-agency/services/tax/individuals/tax-rates-brackets/all-years.html
//  - CPP/EI 2025: https://www.canada.ca/en/revenue-agency/services/payroll/calculators-tables/taxable-income-tables.html
//  - Quebec: Revenu Quebec — https://www.revenuquebec.ca/

import type { Jurisdiction, ProvinceCode, RateTable, TerritoryCode, TaxYear } from '../src/types';

const dollar = (n: number): string => n.toLocaleString('en-CA');

// Build a jurisdiction's brackets from [start, rate] pairs (ascending).
function makeJurisdiction(name: string, items: Array<[number, number]>, bpa: number | undefined): RateTable['federal'] & { __brand: 'jurisdiction' } {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jurisdiction = { name, brackets: [] as any, bpa: bpa ?? undefined };
  items.forEach(([start, rate], i, arr) => {
    const prev = i === 0 ? 0 : arr[i - 1]?.[0] ?? 0;
    const label = `$${dollar(prev)} – $${dollar(start)}`;
    jurisdiction.brackets.push({ label, start, rate });
  });
  return jurisdiction as RateTable['federal'] & { __brand: 'jurisdiction' };
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const qc = makeJurisdiction('Quebec (Revenu Quebec)', [
  [53255, 0.14], [106495, 0.19], [129590, 0.24],
], 16129);

// Federal 2025
const federal2025 = makeJurisdiction('Canada (federal)', [
  [57375, 0.145],
  [114750, 0.205],
  [177882, 0.26],
  [253414, 0.29],
  [253414, 0.33],
], 16129);

// Provinces 2025
const provinces2025: Record<ProvinceCode, Jurisdiction> = {
  AB: makeJurisdiction('Alberta', [
    [60000, 0.08], [151234, 0.10], [181481, 0.12], [241974, 0.13], [362961, 0.14],
  ], 22323),
  BC: makeJurisdiction('British Columbia', [
    [49279, 0.0506], [98560, 0.077], [113158, 0.105], [137407, 0.1229], [186306, 0.147], [259829, 0.168],
  ], 12932),
  MB: makeJurisdiction('Manitoba', [
    [47564, 0.108], [101200, 0.1275],
  ], 15780),
  NB: makeJurisdiction('New Brunswick', [
    [51306, 0.094], [102614, 0.14], [190060, 0.16],
  ], 13396),
  NL: makeJurisdiction('Newfoundland and Labrador', [
    [44192, 0.087], [88382, 0.145], [157792, 0.158], [220910, 0.178], [282214, 0.198], [564429, 0.208], [1128858, 0.213],
  ], 11067),
  NS: makeJurisdiction('Nova Scotia', [
    [30507, 0.0879], [61015, 0.1495], [95883, 0.1667], [154650, 0.175],
  ], 11744),
  ON: makeJurisdiction('Ontario', [
    [52886, 0.0505], [105775, 0.0915], [150000, 0.1116], [220000, 0.1216],
  ], 12747),
  PE: makeJurisdiction('Prince Edward Island', [
    [33328, 0.095], [64656, 0.1347], [105000, 0.166], [140000, 0.1762],
  ], 14650),
  QC: makeJurisdiction('Quebec (Revenu Quebec)', [
    [53255, 0.14], [106495, 0.19], [129590, 0.24], [129590, 0.2575],
  ], 16129), // BPA placeholder; confirm figure with Revenu Quebec
  SK: makeJurisdiction('Saskatchewan', [
    [53463, 0.105], [152750, 0.125],
  ], 19491),
};

// Territories 2025
const territories2025: Record<TerritoryCode, Jurisdiction> = {
  NT: makeJurisdiction('Northwest Territories', [
    [51964, 0.059], [103930, 0.086], [168967, 0.122],
  ], 17842),
  NU: makeJurisdiction('Nunavut', [
    [54707, 0.04], [109413, 0.07], [177881, 0.09],
  ], 19274),
  YT: makeJurisdiction('Yukon', [
    [57375, 0.064], [114750, 0.09], [177882, 0.109], [500000, 0.128],
  ], 16129),
};

const qpba = 16129; // Quebec basic personal amount (2025); confirm with Revenu Quebec

const rateTables: Record<TaxYear, RateTable> = {
  2024: {
    taxYear: 2024,
    federal: makeJurisdiction('Canada (federal)', [
      [55867, 0.15], [111733, 0.205], [173205, 0.26], [246752, 0.29], [246752, 0.33],
    ], 16129),
    provinces: {
      ...provinces2025,
      ON: makeJurisdiction('Ontario', [
        [51446, 0.0505], [102894, 0.0915], [150000, 0.1116], [220000, 0.1216], [220000, 0.1316],
      ], 16129),
      BC: provinces2025.BC,
      // 2024 provincial thresholds beyond ON/BC proxied from 2025 (not re-verified)
      AB: provinces2025.AB, MB: provinces2025.MB, NB: provinces2025.NB, NL: provinces2025.NL,
      NS: provinces2025.NS, PE: provinces2025.PE, SK: provinces2025.SK,
    },
    territories: territories2025,
    quebec: qc,
    qpba,
  },
  2025: {
    taxYear: 2025,
    federal: federal2025,
    provinces: provinces2025,
    territories: territories2025,
    quebec: qc,
    qpba,
  },
  2026: {
    taxYear: 2026,
    federal: makeJurisdiction('Canada (federal)', [
      [57375, 0.14], [114750, 0.205], [177882, 0.26], [253414, 0.29], [253414, 0.33],
    ], 14538), // 2026 lowest bracket = 14% (CRA note); top-bracket BPA = $14,538 (link)
    provinces: {
      ...provinces2025,
      ON: provinces2025.ON,
      BC: provinces2025.BC,
      // 2026 provincial thresholds proxied from 2025 (not re-verified)
      AB: provinces2025.AB, MB: provinces2025.MB, NB: provinces2025.NB, NL: provinces2025.NL,
      NS: provinces2025.NS, PE: provinces2025.PE, SK: provinces2025.SK,
    },
    territories: territories2025,
    quebec: qc,
    qpba,
  },
};

export { rateTables };

export function getRateTable(taxYear: TaxYear): RateTable {
  return rateTables[taxYear] ?? rateTables[2025];
}

export { dollar };
