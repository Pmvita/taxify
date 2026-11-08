import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {
  calculateEmployeeTax,
  calculateSoleProprietorTax,
  calculateCorporateTax,
  getRateTable,
  currency,
} from '@taxify/core';
import type { ProvinceCode, PersonType } from '@taxify/core';

const PROVINCES: { value: ProvinceCode; label: string }[] = [
  { value: 'AB', label: 'Alberta' },
  { value: 'BC', label: 'British Columbia' },
  { value: 'MB', label: 'Manitoba' },
  { value: 'NB', label: 'New Brunswick' },
  { value: 'NL', label: 'Newfoundland and Labrador' },
  { value: 'NS', label: 'Nova Scotia' },
  { value: 'ON', label: 'Ontario' },
  { value: 'PE', label: 'Prince Edward Island' },
  { value: 'QC', label: 'Quebec' },
  { value: 'SK', label: 'Saskatchewan' },
];

type Mode = 'employee' | 'soleProprietor' | 'corporation';

export function CalculatorScreen() {
  const [mode, setMode] = useState<Mode>('employee');
  const [employeeGross, setEmployeeGross] = useState('75000');
  const [employeeProvince, setEmployeeProvince] = useState<ProvinceCode>('ON');

  const [proprietorRevenue, setProprietorRevenue] = useState('100000');
  const [proprietorExpenses, setProprietorExpenses] = useState('30000');
  const [proprietorProvince, setProprietorProvince] = useState<ProvinceCode>('ON');
  const [claimCpp, setClaimCpp] = useState(true);

  const [corpIncome, setCorpIncome] = useState('500000');
  const [corpProvince, setCorpProvince] = useState<ProvinceCode>('BC');

  const [result, setResult] = useState<any>(null);

  const runEmployee = () => {
    const r = calculateEmployeeTax(getRateTable(2025), {
      grossIncome: Number(employeeGross) || 0,
      province: employeeProvince,
    });
    setResult(r);
  };

  const runSole = () => {
    const r = calculateSoleProprietorTax(getRateTable(2025), {
      revenue: Number(proprietorRevenue) || 0,
      expenses: Number(proprietorExpenses) || 0,
      province: proprietorProvince,
      claimCpp,
    });
    setResult(r);
  };

  const runCorp = () => {
    const r = calculateCorporateTax(getRateTable(2025), {
      taxableIncome: Number(corpIncome) || 0,
      province: corpProvince,
    });
    setResult(r);
  };

  const pickProvince = (setter: (v: ProvinceCode) => void, label: string) => {
    // @ts-ignore
    const alertOptions = [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK', onPress: (text: string) => {
            const v = PROVINCES.find((p) => p.label === text)?.value;
            if (v) setter(v);
          }, style: 'default' },
    ] as any;
    // @ts-ignore
    Alert.alert('Province', 'Select province', PROVINCES.map((p) => ({ text: p.label })), alertOptions);
  };

  const modes: { value: Mode; label: string }[] = [
    { value: 'employee', label: 'Employee' },
    { value: 'soleProprietor', label: 'Sole proprietor' },
    { value: 'corporation', label: 'Corporation' },
  ];

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.brand}>Taxify</Text>
          <Text style={styles.title}>
            {mode === 'employee' ? 'Payroll' : mode === 'soleProprietor' ? 'Business' : 'Corporate'} — tax calculator
          </Text>
        </View>

        <View style={styles.tabBar}>
          {modes.map((m) => (
            <TouchableOpacity
              key={m.value}
              style={[styles.tab, mode === m.value && styles.tabActive]}
              onPress={() => setMode(m.value)}
            >
              <Text style={[styles.tabText, mode === m.value && styles.tabTextActive]}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {mode === 'employee' && (
          <View style={styles.card}>
            <Text style={styles.section}>Employee tax</Text>
            <View style={styles.row}>
              <View style={styles.field}>
                <Text style={styles.label}>Gross income (CAD)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={employeeGross}
                  onChangeText={setEmployeeGross}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Province</Text>
                <TouchableOpacity
                  style={styles.select}
                  onPress={() => pickProvince(setEmployeeProvince, 'province')}
                >
                  <Text style={styles.selectText}>{employeeProvince}</Text>
                  <Text style={styles.chevron}>▾</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={runEmployee}>
              <Text style={styles.buttonText}>Calculate</Text>
            </TouchableOpacity>
            {result && (
              <View style={styles.results}>
                <Text style={styles.resultTitle}>Take-home pay</Text>
                <Text style={styles.resultValue}>{currency(result.netPay)}</Text>
                <View style={styles.resultGrid}>
                  <View style={styles.resultCell}>
                    <Text style={styles.resultLabel}>CPP</Text>
                    <Text style={styles.resultText}>{currency(result.cpp)}</Text>
                  </View>
                  <View style={styles.resultCell}>
                    <Text style={styles.resultLabel}>EI</Text>
                    <Text style={styles.resultText}>{currency(result.ei)}</Text>
                  </View>
                  <View style={styles.resultCell}>
                    <Text style={styles.resultLabel}>Federal</Text>
                    <Text style={styles.resultText}>{currency(result.federalTax)}</Text>
                  </View>
                  <View style={styles.resultCell}>
                    <Text style={styles.resultLabel}>Provincial</Text>
                    <Text style={styles.resultText}>{currency(result.provincialTax)}</Text>
                  </View>
                  <View style={styles.resultCell}>
                    <Text style={styles.resultLabel}>Total tax</Text>
                    <Text style={styles.resultText}>{currency(result.totalIncomeTax)}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}

        {mode === 'soleProprietor' && (
          <View style={styles.card}>
            <Text style={styles.section}>Sole proprietor (T2125)</Text>
            <View style={styles.row}>
              <View style={styles.field}>
                <Text style={styles.label}>Revenue</Text>
                <TextInput style={styles.input} keyboardType="numeric" value={proprietorRevenue} onChangeText={setProprietorRevenue} />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Expenses</Text>
                <TextInput style={styles.input} keyboardType="numeric" value={proprietorExpenses} onChangeText={setProprietorExpenses} />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.field}>
                <Text style={styles.label}>Province</Text>
                <TouchableOpacity
                  style={styles.select}
                  onPress={() => pickProvince(setProprietorProvince, 'province')}
                >
                  <Text style={styles.selectText}>{proprietorProvince}</Text>
                  <Text style={styles.chevron}>▾</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Claim CPP</Text>
                <Switch
                  value={claimCpp}
                  onValueChange={setClaimCpp}
                  trackColor={{ false: '#7c8591', true: '#f5a623' }}
                  thumbColor="#fff"
                />
              </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={runSole}>
              <Text style={styles.buttonText}>Calculate</Text>
            </TouchableOpacity>
            {result && (
              <View style={styles.results}>
                <Text style={styles.resultTitle}>Net income tax</Text>
                <Text style={styles.resultValue}>{currency(result.totalIncomeTax)}</Text>
                <View style={styles.resultGrid}>
                  <View style={styles.resultCell}>
                    <Text style={styles.resultLabel}>Business net income</Text>
                    <Text style={styles.resultText}>{currency(result.businessNetIncome)}</Text>
                  </View>
                  <View style={styles.resultCell}>
                    <Text style={styles.resultLabel}>CPP</Text>
                    <Text style={styles.resultText}>{currency(result.cpp)}</Text>
                  </View>
                  <View style={styles.resultCell}>
                    <Text style={styles.resultLabel}>EI</Text>
                    <Text style={styles.resultText}>{currency(result.ei)}</Text>
                  </View>
                  <View style={styles.resultCell}>
                    <Text style={styles.resultLabel}>Est. quarterly</Text>
                    <Text style={styles.resultText}>{currency(result.estQuarterly[0])}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}

        {mode === 'corporation' && (
          <View style={styles.card}>
            <Text style={styles.section}>Corporation (T2)</Text>
            <View style={styles.row}>
              <View style={styles.field}>
                <Text style={styles.label}>Taxable income (CAD)</Text>
                <TextInput style={styles.input} keyboardType="numeric" value={corpIncome} onChangeText={setCorpIncome} />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Province</Text>
                <TouchableOpacity
                  style={styles.select}
                  onPress={() => pickProvince(setCorpProvince, 'province')}
                >
                  <Text style={styles.selectText}>{corpProvince}</Text>
                  <Text style={styles.chevron}>▾</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={runCorp}>
              <Text style={styles.buttonText}>Calculate</Text>
            </TouchableOpacity>
            {result && (
              <View style={styles.results}>
                <Text style={styles.resultTitle}>Corporate tax</Text>
                <Text style={styles.resultValue}>{currency(result.total)}</Text>
                <View style={styles.resultGrid}>
                  <View style={styles.resultCell}>
                    <Text style={styles.resultLabel}>Taxable income</Text>
                    <Text style={styles.resultText}>{currency(result.taxableIncome)}</Text>
                  </View>
                  <View style={styles.resultCell}>
                    <Text style={styles.resultLabel}>Federal</Text>
                    <Text style={styles.resultText}>{currency(result.federalTax)}</Text>
                  </View>
                  <View style={styles.resultCell}>
                    <Text style={styles.resultLabel}>Provincial</Text>
                    <Text style={styles.resultText}>{currency(result.provincialTax)}</Text>
                  </View>
                  <View style={styles.resultCell}>
                    <Text style={styles.resultLabel}>AMT refundable</Text>
                    <Text style={styles.resultText}>{currency(result.amtArefundable)}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#141a24' },
  scroll: { padding: 20, paddingBottom: 32 },
  header: { alignItems: 'center', marginTop: 20 },
  brand: { fontSize: 22, fontWeight: '700', color: '#f5a623', letterSpacing: 1 },
  title: { fontSize: 16, color: '#b9c2cf', marginTop: 4, fontWeight: '500' },
  tabBar: { flexDirection: 'row', marginTop: 18, gap: 12, paddingHorizontal: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: '#33445c', borderRadius: 10 },
  tabActive: { backgroundColor: '#20293a', borderColor: '#f5a623' },
  tabText: { fontSize: 14, color: '#b9c2cf', fontWeight: '600' },
  tabTextActive: { color: '#f5a623' },
  card: { backgroundColor: '#20293a', borderWidth: 1, borderColor: '#2a3548', borderRadius: 14, padding: 16, marginTop: 16 },
  section: { fontSize: 15, fontWeight: '700', color: '#eceff5', marginBottom: 12 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  field: { flex: 1 },
  label: { fontSize: 12, color: '#8a96a6', marginBottom: 6, fontWeight: '600' },
  input: { backgroundColor: '#1c2430', color: '#eceff5', borderRadius: 9, paddingHorizontal: 12, paddingVertical: 12, fontSize: 15, borderWidth: 1, borderColor: '#33445c' },
  select: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1c2430', color: '#eceff5', borderRadius: 9, paddingHorizontal: 12, paddingVertical: 12, fontSize: 15, borderWidth: 1, borderColor: '#33445c' },
  selectText: { color: '#eceff5', fontSize: 15, fontWeight: '600' },
  chevron: { fontSize: 14, color: '#8a96a6' },
  button: { backgroundColor: '#f5a623', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#141a24', fontSize: 15, fontWeight: '700' },
  results: { marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#2a3548' },
  resultTitle: { fontSize: 13, fontWeight: '700', color: '#8a96a6', marginBottom: 8 },
  resultValue: { fontSize: 20, fontWeight: '800', color: '#f5a623', marginBottom: 10 },
  resultGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  resultCell: { flex: 1, minWidth: 90, backgroundColor: '#273348', borderRadius: 8, padding: 10 },
  resultLabel: { fontSize: 11, color: '#8a96a6', fontWeight: '600' },
  resultText: { fontSize: 14, fontWeight: '700', color: '#eceff5', marginTop: 2 },
});
