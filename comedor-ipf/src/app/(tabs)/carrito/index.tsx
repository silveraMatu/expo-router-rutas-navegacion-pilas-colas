import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DondeEstoy } from '@/components/DondeEstoy';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useApp } from '@/context/AppContext';

export default function CarritoScreen() {
  const { items, total, deshacerUltimo, puedeDeshacer, tamanioPilaDeshacer } = useApp();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title">Carrito</ThemedText>

        {items.length === 0 ? (
          <View style={styles.vacio}>
            <ThemedText type="default" themeColor="textSecondary">
              Tu carrito está vacío.
            </ThemedText>
            <Link href="/menu" asChild>
              <Pressable>
                <ThemedText type="link">Ir al menú</ThemedText>
              </Pressable>
            </Link>
          </View>
        ) : (
          <View style={styles.lista}>
            {items.map((plato, indice) => (
              <View key={`${plato.id}-${indice}`} style={styles.fila}>
                <ThemedText type="default">{plato.nombre}</ThemedText>
                <ThemedText type="smallBold">${plato.precio}</ThemedText>
              </View>
            ))}

            <View style={styles.filaTotal}>
              <ThemedText type="smallBold">Total</ThemedText>
              <ThemedText type="smallBold">${total}</ThemedText>
            </View>
          </View>
        )}

        <View style={styles.acciones}>
          <Pressable onPress={deshacerUltimo} disabled={!puedeDeshacer} style={styles.boton}>
            <ThemedText type="link" themeColor={puedeDeshacer ? 'text' : 'textSecondary'}>
              Deshacer último
            </ThemedText>
          </Pressable>
          {/* Ayuda didáctica: muestra cuántos "agregar" quedan en la pila de deshacer. */}
          <ThemedText type="small" themeColor="textSecondary">
            Pila de deshacer: {tamanioPilaDeshacer}
          </ThemedText>

          <Link href="/carrito/nota" asChild>
            <Pressable style={styles.boton}>
              <ThemedText type="link">Agregar nota</ThemedText>
            </Pressable>
          </Link>

          <Link href="/confirmar" asChild>
            <Pressable disabled={items.length === 0} style={styles.boton}>
              <ThemedText type="link" themeColor={items.length === 0 ? 'textSecondary' : 'text'}>
                Confirmar pedido
              </ThemedText>
            </Pressable>
          </Link>
        </View>

        <DondeEstoy />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: 16, gap: 16 },
  vacio: { gap: 8, paddingVertical: 16 },
  lista: { gap: 4 },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  filaTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128,128,128,0.3)',
    marginTop: 4,
  },
  acciones: { gap: 8 },
  boton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(128,128,128,0.15)',
  },
});
