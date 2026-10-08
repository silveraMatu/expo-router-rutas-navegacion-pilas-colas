import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DondeEstoy } from '@/components/DondeEstoy';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useApp } from '@/context/AppContext';

export default function AtendidosScreen() {
  // "atendidos" ya viene del contexto ordenado del tope a la base de la
  // Pila<Pedido> (el último atendido, primero).
  const { atendidos } = useApp();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title">Atendidos</ThemedText>

        {atendidos.length === 0 ? (
          <ThemedText type="default" themeColor="textSecondary">
            Todavía no se atendió ningún pedido.
          </ThemedText>
        ) : (
          atendidos.map((pedido) => (
            <View key={pedido.numero} style={styles.fila}>
              <ThemedText type="default">Turno #{pedido.numero}</ThemedText>
              <ThemedText type="smallBold">${pedido.total}</ThemedText>
            </View>
          ))
        )}

        <DondeEstoy />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: 16, gap: 8 },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
});
