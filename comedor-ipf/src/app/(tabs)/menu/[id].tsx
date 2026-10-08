import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DondeEstoy } from '@/components/DondeEstoy';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useApp } from '@/context/AppContext';
import { obtenerPlatoPorId, type Plato } from '@/data/platos';

export default function PlatoScreen() {
  const { id } = useLocalSearchParams<'/menu/[id]'>();
  const idNumerico = Number(id);
  // El param de ruta siempre llega como string: hay que convertirlo y validar
  // que sea un número real y que exista un plato con ese id.
  const plato = Number.isNaN(idNumerico) ? undefined : obtenerPlatoPorId(idNumerico);

  if (plato === undefined) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <Stack.Screen options={{ title: 'Plato' }} />
          <ThemedText type="title">El plato no existe</ThemedText>
          <Link href="/menu" asChild>
            <Pressable style={styles.boton}>
              <ThemedText type="link">Volver al menú</ThemedText>
            </Pressable>
          </Link>
          <DondeEstoy />
        </SafeAreaView>
      </ThemedView>
    );
  }

  return <DetallePlato plato={plato} />;
}

function DetallePlato({ plato }: { plato: Plato }) {
  const { agregarAlCarrito } = useApp();
  const [agregado, setAgregado] = useState(false);

  const confirmarAgregado = () => {
    agregarAlCarrito(plato);
    setAgregado(true);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ title: plato.nombre }} />
        <ThemedText type="title">{plato.nombre}</ThemedText>
        <ThemedText type="subtitle">${plato.precio}</ThemedText>
        <ThemedText type="default" themeColor="textSecondary">
          {plato.descripcion}
        </ThemedText>

        <Pressable onPress={confirmarAgregado} style={styles.boton}>
          <ThemedText type="link">{agregado ? 'Agregado ✓' : 'Agregar al carrito'}</ThemedText>
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
