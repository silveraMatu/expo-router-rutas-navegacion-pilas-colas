import { Link } from 'expo-router';
import { Pressable, SectionList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DondeEstoy } from '@/components/DondeEstoy';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CATEGORIAS, platosPorCategoria, type Plato } from '@/data/platos';

const NOMBRE_CATEGORIA: Record<string, string> = {
  desayuno: 'Desayuno',
  almuerzo: 'Almuerzo',
  bebidas: 'Bebidas',
  kiosco: 'Kiosco',
};

const SECCIONES = CATEGORIAS.map((categoria) => ({
  title: categoria,
  data: platosPorCategoria(categoria),
}));

export default function MenuScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.encabezado}>
          <ThemedText type="title">Menú</ThemedText>

          <Link href="/buscar" asChild>
            <Pressable style={styles.botonBuscar}>
              <ThemedText type="link">🔎 Buscar</ThemedText>
            </Pressable>
          </Link>

          <View style={styles.chips}>
            {CATEGORIAS.map((categoria) => (
              <Link key={categoria} href={{ pathname: '/categorias/[categoria]', params: { categoria } }} asChild>
                <Pressable style={styles.chip}>
                  <ThemedText type="small">{NOMBRE_CATEGORIA[categoria]}</ThemedText>
                </Pressable>
              </Link>
            ))}
          </View>
        </View>

        <SectionList
          sections={SECCIONES}
          keyExtractor={(plato: Plato) => String(plato.id)}
          renderSectionHeader={({ section }) => (
            <ThemedView type="background" style={styles.encabezadoSeccion}>
              <ThemedText type="smallBold">{NOMBRE_CATEGORIA[section.title]}</ThemedText>
            </ThemedView>
          )}
          renderItem={({ item }) => (
            <Link href={{ pathname: '/menu/[id]', params: { id: item.id } }} asChild>
              <Pressable style={styles.fila}>
                <ThemedText type="default">{item.nombre}</ThemedText>
                <ThemedText type="smallBold">${item.precio}</ThemedText>
              </Pressable>
            </Link>
          )}
        />

        <DondeEstoy />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: 16, gap: 8 },
  encabezado: { gap: 8 },
  botonBuscar: { alignSelf: 'flex-start' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(128,128,128,0.15)',
  },
  encabezadoSeccion: { paddingVertical: 8 },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
});
