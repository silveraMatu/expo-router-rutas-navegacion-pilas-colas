import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DondeEstoy } from '@/components/DondeEstoy';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useApp } from '@/context/AppContext';

export default function ConfirmarScreen() {
  const { items, nota, total, confirmarPedido } = useApp();

  const cerrar = () => router.back();

  const confirmar = () => {
    const pedido = confirmarPedido();
    // replace (no push): esta pantalla muestra el resumen de UN pedido que
    // recién se está creando. Si navegáramos con push, ese resumen quedaría
    // apilado debajo de /turno con "Confirmar" todavía activo: "atrás" desde
    // el turno volvería a un pedido YA confirmado y se podría tocar de nuevo,
    // generando un segundo pedido por error. Con replace, /confirmar
    // desaparece del historial: "atrás" desde /turno va directo a donde
    // estaba el usuario antes de confirmar (el carrito), sin pasar por acá.
    router.replace({ pathname: '/turno/[numero]', params: { numero: pedido.numero } });
  };

  if (items.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedText type="title">No hay nada para confirmar</ThemedText>
          <ThemedText type="default" themeColor="textSecondary">
            Tu carrito está vacío.
          </ThemedText>
          <Pressable onPress={cerrar} style={styles.boton}>
            <ThemedText type="link">Cerrar</ThemedText>
          </Pressable>
          <DondeEstoy />
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title">Confirmar pedido</ThemedText>

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

        {nota.trim() !== '' && (
          <ThemedText type="small" themeColor="textSecondary">
            Nota: {nota}
          </ThemedText>
        )}

        <View style={styles.acciones}>
          <Pressable onPress={confirmar} style={styles.boton}>
            <ThemedText type="link">Confirmar</ThemedText>
          </Pressable>
          <Pressable onPress={cerrar} style={styles.boton}>
            <ThemedText type="link">Cancelar</ThemedText>
          </Pressable>
        </View>

        <DondeEstoy />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: 16, gap: 16 },
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
