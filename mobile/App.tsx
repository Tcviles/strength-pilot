import { StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent isDarkMode={isDarkMode} />
    </SafeAreaProvider>
  );
}

function AppContent({ isDarkMode }: { isDarkMode: boolean }) {
  const insets = useSafeAreaInsets();
  const bg = isDarkMode ? '#0B0B0C' : '#FAFAF7';
  const fg = isDarkMode ? '#F4F2EC' : '#121212';
  const muted = isDarkMode ? '#8A8680' : '#5A5852';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: bg, paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <Text style={[styles.wordmark, { color: fg }]}>Lumio.fit</Text>
      <Text style={[styles.tagline, { color: muted }]}>Clarity in every rep.</Text>
      <View style={styles.quoteWrap}>
        <Text style={[styles.quote, { color: muted }]}>
          "We are what we repeatedly do."
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  wordmark: { fontSize: 40, fontWeight: '700', letterSpacing: -0.5 },
  tagline: { fontSize: 16, marginTop: 8, letterSpacing: 0.4 },
  quoteWrap: { position: 'absolute', bottom: 48, alignItems: 'center' },
  quote: { fontSize: 13, fontStyle: 'italic' },
});

export default App;
