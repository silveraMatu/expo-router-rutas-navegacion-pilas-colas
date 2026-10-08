import { usePathname } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DondeEstoy } from '@/components/DondeEstoy';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function NotFoundScreen() {
  const pathname = usePathname();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title">404</ThemedText>
        <ThemedText type="default">
          La ruta <ThemedText type="code">{pathname}</ThemedText> no existe.
        </ThemedText>
        <DondeEstoy />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: 16, gap: 8 },
});
