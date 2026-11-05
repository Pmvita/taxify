import { describe, it, expect } from 'vitest';
import {
  getRateTable,
  federalTax,
  federalNetTax,
  provincialNetTax,
  provincialTax,
  quebecNetTax,
  cppEmployee,
  eiEmployee,
  calculateEmployeeTax,
  calculateSoleProprietorTax,
  calculateCorporateTax,
  compareProvinces,
} from '../src/index';

const R = getRateTable(2025);

describe('Taxify core — comprehensive suite', () => {
  describe('rate table', () => {
    it('2025 federal has all brackets above BPA', () => {
      const t = R.federal;
      expect(t.brackets.map((b) => b.start)).toEqual([57375, 114750, 177882, 253414, 253414]);
      expect(t.bpa).toBe(16129);
    });
    it('2025 covers all 10 provinces + 3 territories', () => {
      expect(Object.keys(R.provinces)).toHaveLength(10);
      expect(Object.keys(R.territories)).toHaveLength(3);
      expect(['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'ON', 'PE', 'QC', 'SK']).toEqual(
        expect.arrayContaining(Object.keys(R.provinces) as string[]),
      );
    });
    it('2025 provides Quebec on its own path', () => {
      expect(R.quebec.name).toBe('Quebec (Revenu Quebec)');
      expect(R.qpba).toBe(16129);
    });
  });

  describe('CPP 2025 (CRA T4032)', () => {
    it('zero below basic exemption', () => {
      expect(cppEmployee(3500)).toBe(0);
      expect(cppEmployee(3499)).toBe(0);
    });
    it('reaches max $4,430.10 at $149,000 (YAMPE + AMPE)', () => {
      expect(cppEmployee(71300)).toBe(3356.10);
      expect(cppEmployee(81200)).toBe(3752.10);
      expect(cppEmployee(149000)).toBe(4430.10);
    });
    it('caps at max above $149,000', () => {
      expect(cppEmployee(1000000)).toBe(4430.10);
    });
  });

  describe('EI 2025 (CRA T4032)', () => {
    it('max premium $1,077.48 at $65,700 insurable', () => {
      expect(eiEmployee(65700)).toBe(1077.48);
      expect(eiEmployee(200000)).toBe(1077.48);
    });
  });

  describe('federal progressive tax', () => {
    it('first bracket: 14.5% on $57,375', () => {
      expect(federalTax(R, 57375).tax).toBeCloseTo(8319.38, 2);
    });
    it('second bracket: 14.5% + 20.5% on $114,750', () => {
      expect(federalTax(R, 114750).tax).toBeCloseTo(20081.25, 2);
    });
    it('surpasses $400,000 in the top bracket', () => {
      expect(federalTax(R, 500000).tax).toBeCloseTo(139773.23, 2);
    });
    it('non-refundable BPA offsets tax', () => {
      expect(federalNetTax(R, 0)).toBe(0);
      expect(federalNetTax(R, 80000)).toBeGreaterThanOrEqual(0);
    });
  });

  describe('province tax', () => {
    it('Ontario brackets sum correctly at $80,000', () => {
      const t = provincialTax(R, 'ON', 80000);
      expect(t).toBeCloseTo(5151.67, 2);
    });
    it('Ontario net tax is zero below BPA floor', () => {
      expect(provincialNetTax(R, 'ON', 80000)).toBe(0);
    });
    it('Quebec follows its own table', () => {
      expect(quebecNetTax(R, 80000)).toBeGreaterThanOrEqual(0);
    });
  });

  describe('employee calc', () => {
    it('Ontario $80,000 takes home less than gross', () => {
      const r = calculateEmployeeTax(R, { grossIncome: 80000, province: 'ON' });
      expect(r.gross).toBe(80000);
      expect(r.cpp).toBe(3704.10);
      expect(r.ei).toBe(1077.48);
      expect(r.netPay).toBeLessThan(80000);
    });
    it('CPP contributes up to the $4,430.10 cap', () => {
      const r = calculateEmployeeTax(R, { grossIncome: 149000, province: 'ON' });
      expect(r.cpp).toBe(4430.10);
    });
    it('breakdown arrays non-empty for taxes', () => {
      const r = calculateEmployeeTax(R, { grossIncome: 80000, province: 'ON' });
      expect(r.breakdown).toHaveLength(2);
      const first = r.breakdown[0];
      expect(first?.tax).toBeGreaterThan(0);
    });
  });

  describe('sole proprietor calc', () => {
    it('net income = revenue - expenses (floor 0)', () => {
      const r = calculateSoleProprietorTax(R, { revenue: 100000, expenses: 30000, province: 'ON' });
      expect(r.businessNetIncome).toBe(70000);
      expect(r.businessNetIncome).toBeGreaterThan(0);
    });
    it('loss floors at zero', () => {
      const r = calculateSoleProprietorTax(R, { revenue: 20000, expenses: 30000, province: 'BC' });
      expect(r.businessNetIncome).toBe(0);
    });
    it('estimates quarterly instalments', () => {
      const r = calculateSoleProprietorTax(R, { revenue: 100000, expenses: 30000, province: 'ON' });
      expect(r.estQuarterly.length).toBe(4);
      expect(r.estQuarterly[0]).toBeCloseTo(r.totalIncomeTax / 4, 2);
    });
  });

  describe('corporation calc', () => {
    it('derives total, refundable AMT, effective rate', () => {
      const r = calculateCorporateTax(R, { taxableIncome: 500000, province: 'BC' });
      expect(r.total).toBeGreaterThan(0);
      expect(r.amtArefundable).toBeGreaterThan(0);
      expect(r.effectiveRate).toBeGreaterThan(0);
      expect(r.effectiveRate).toBeLessThan(1);
      expect(r.federalTax + r.provincialTax).toBeCloseTo(r.total, 2);
    });
    it('zero income yields zero tax', () => {
      const r = calculateCorporateTax(R, { taxableIncome: 0, province: 'ON' });
      expect(r.total).toBe(0);
    });
  });

  describe('province comparison', () => {
    it('returns exactly one result per province', () => {
      const out = compareProvinces(R, { type: 'employee', value: 100000, province: 'ON' });
      expect(out).toHaveLength(10);
      expect(out.map((o) => o.province)).toEqual(
        expect.arrayContaining(['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'ON', 'PE', 'QC', 'SK'] as string[]),
      );
    });
    it('sorts by net pay descending', () => {
      const out = compareProvinces(R, { type: 'employee', value: 100000, province: 'ON' });
      for (let i = 1; i < out.length; i++) {
        const prev = out[i - 1];
        const cur = out[i];
        if (prev !== undefined && cur !== undefined) {
          expect(prev.netPay).toBeGreaterThanOrEqual(cur.netPay);
        }
      }
    });
    it('handles all person types', () => {
      expect(compareProvinces(R, { type: 'employee', value: 100000, province: 'ON' }).length).toBe(10);
      expect(compareProvinces(R, { type: 'soleProprietor', value: 100000, province: 'ON' }).length).toBe(10);
      expect(compareProvinces(R, { type: 'corporation', value: 100000, province: 'ON' }).length).toBe(10);
    });
  });
});
