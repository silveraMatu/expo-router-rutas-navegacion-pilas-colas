import { Link, router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DondeEstoy } from '@/components/DondeEstoy';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CATEGORIAS, esCategoriaValida, PLATOS, type Categoria } from '@/data/platos';

const NOMBRE_CATEGORIA: Record<Categoria, string> = {
  desayuno: 'Desayuno',
  almuerzo: 'Almuerzo',
  bebidas: 'Bebidas',
  kiosco: 'Kiosco',
};

/** Quita mayúsculas y acentos para comparar texto sin distinguirlos. */
function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

function aTexto(valor: string | string[] | undefined): string {
  if (Array.isArray(valor)) return valor[0] ?? '';
  return valor ?? '';
}

export default function BuscarScreen() {
  // El estado de la búsqueda vive solo en la URL (los query params), así la
  // pantalla queda en un estado que se puede compartir o recargar sin perderse.
  const params = useLocalSearchParams<'/buscar'>();
  const q = aTexto(params.q);
  const categoriaParam = aTexto(params.categoria);
  const categoriaActiva = esCategoriaValida(categoriaParam) ? categoriaParam : undefined;

  const platosFiltrados = useMemo(() => {
    const textoNormalizado = normalizar(q);
    return PLATOS.filter((plato) => {
      const coincideTexto = textoNormalizado === '' || normalizar(plato.nombre).includes(textoNormalizado);
      const coincideCategoria = categoriaActiva === undefined || plato.categoria === categoriaActiva;
      return coincideTexto && coincideCategoria;
    });
  }, [q, categoriaActiva]);

  const alternarCategoria = (categoria: Categoria) => {
    router.setParams<'/buscar'>({ categoria: categoriaActiva === categoria ? undefined : categoria });
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title">Buscar</ThemedText>

        <TextInput
          value={q}
          onChangeText={(texto) => router.setParams<'/buscar'>({ q: texto })}
          placeholder="Buscar un plato..."
          style={styles.input}
        />

        <ThemedView style={styles.chips}>
          {CATEGORIAS.map((categoria) => (
            <Pressable
              key={categoria}
              onPress={() => alternarCategoria(categoria)}
              style={[styles.chip, categoriaActiva === categoria && styles.chipActivo]}>
              <ThemedText type="small">{NOMBRE_CATEGORIA[categoria]}</ThemedText>
            </Pressable>
          ))}
        </ThemedView>

        {platosFiltrados.map((plato) => (
          <Link key={plato.id} href={{ pathname: '/menu/[id]', params: { id: plato.id } }} asChild>
            <Pressable style={styles.fila}>
              <ThemedText type="default">{plato.nombre}</ThemedText>
              <ThemedText type="smallBold">${plato.precio}</ThemedText>
            </Pressable>
          </Link>
        ))}

        {platosFiltrados.length === 0 && (
          <ThemedText type="small" themeColor="textSecondary">
            No se encontraron platos.
          </ThemedText>
        )}

        <DondeEstoy />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: 16, gap: 12 },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.4)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(128,128,128,0.15)',
  },
  chipActivo: {
    backgroundColor: 'rgba(60,135,247,0.35)',
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
});
