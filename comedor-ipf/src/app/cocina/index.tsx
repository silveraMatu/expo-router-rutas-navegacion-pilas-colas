import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DondeEstoy } from '@/components/DondeEstoy';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useApp } from '@/context/AppContext';

export default function PedidoActualScreen() {
  const { pedidoEnFrente, cantidadEnEspera, atenderSiguiente } = useApp();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title">Pedido actual</ThemedText>

        {pedidoEnFrente === undefined ? (
          <ThemedText type="default" themeColor="textSecondary">
            No hay pedidos
          </ThemedText>
        ) : (
          <>
            <ThemedText type="subtitle">Turno #{pedidoEnFrente.numero}</ThemedText>
            {pedidoEnFrente.items.map((plato, indice) => (
              <ThemedText key={`${plato.id}-${indice}`} type="default">
                {plato.nombre}
              </ThemedText>
            ))}
            {pedidoEnFrente.nota.trim() !== '' && (
              <ThemedText type="small" themeColor="textSecondary">
                Nota: {pedidoEnFrente.nota}
              </ThemedText>
            )}
            <ThemedText type="smallBold">Total: ${pedidoEnFrente.total}</ThemedText>
          </>
        )}

        <ThemedText type="small" themeColor="textSecondary">
          En espera: {cantidadEnEspera}
        </ThemedText>

        {/* Solo se atiende el frente de la cola: no hay forma de "elegir" otro pedido. */}
        <Pressable
          onPress={atenderSiguiente}
          disabled={pedidoEnFrente === undefined}
          style={styles.boton}>
          <ThemedText type="link" themeColor={pedidoEnFrente === undefined ? 'textSecondary' : 'text'}>
            Atender siguiente
          </ThemedText>
        </Pressable>

        <DondeEstoy />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: 16, gap: 8 },
  boton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(128,128,128,0.15)',
  },
});
