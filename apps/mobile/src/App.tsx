import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CalculatorScreen } from './screens/CalculatorScreen';

export default function App() {
  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <CalculatorScreen />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#141a24' },
  scroll: { padding: 20, paddingBottom: 32 },
});
