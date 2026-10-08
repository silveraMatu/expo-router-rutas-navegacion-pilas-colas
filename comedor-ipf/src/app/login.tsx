import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DondeEstoy } from '@/components/DondeEstoy';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// Esqueleto: el formulario de login se implementa en una tarea posterior.
export default function LoginScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title">Iniciar sesión</ThemedText>
        <DondeEstoy />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: 16, gap: 8 },
});
