import { Link } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DondeEstoy } from '@/components/DondeEstoy';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const ENLACES = [
  { href: '/ayuda/pagos/efectivo', titulo: 'Pago en efectivo' },
  { href: '/ayuda/pagos/tarjeta', titulo: 'Pago con tarjeta' },
  { href: '/ayuda/horarios', titulo: 'Horarios de atención' },
] as const;

export default function AyudaScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title">Ayuda</ThemedText>

        {ENLACES.map((enlace) => (
          <Link key={enlace.href} href={enlace.href} asChild>
            <Pressable style={styles.fila}>
              <ThemedText type="link">{enlace.titulo}</ThemedText>
            </Pressable>
          </Link>
        ))}

        <DondeEstoy />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: 16, gap: 8 },
  fila: { paddingVertical: 10 },
});
