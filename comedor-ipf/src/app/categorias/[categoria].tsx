import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DondeEstoy } from '@/components/DondeEstoy';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { esCategoriaValida, platosPorCategoria } from '@/data/platos';

const NOMBRE_CATEGORIA: Record<string, string> = {
  desayuno: 'Desayuno',
  almuerzo: 'Almuerzo',
  bebidas: 'Bebidas',
  kiosco: 'Kiosco',
};

export default function CategoriaScreen() {
  const { categoria } = useLocalSearchParams<'/categorias/[categoria]'>();

  if (!esCategoriaValida(categoria)) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <Stack.Screen options={{ title: 'Categoría' }} />
          <ThemedText type="title">La categoría no existe</ThemedText>
          <DondeEstoy />
        </SafeAreaView>
      </ThemedView>
    );
  }

  const platos = platosPorCategoria(categoria);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ title: NOMBRE_CATEGORIA[categoria] }} />
        <ThemedText type="title">{NOMBRE_CATEGORIA[categoria]}</ThemedText>

        {platos.map((plato) => (
          <Link key={plato.id} href={{ pathname: '/menu/[id]', params: { id: plato.id } }} asChild>
            <Pressable style={styles.fila}>
              <ThemedText type="default">{plato.nombre}</ThemedText>
              <ThemedText type="smallBold">${plato.precio}</ThemedText>
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
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
});
