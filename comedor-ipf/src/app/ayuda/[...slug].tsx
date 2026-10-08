import { Link, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DondeEstoy } from '@/components/DondeEstoy';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const CONTENIDO_POR_SECCION: Record<string, { titulo: string; texto: string }> = {
  pagos: {
    titulo: 'Medios de pago',
    texto: 'Podés pagar en efectivo o con tarjeta de débito/crédito en la caja del comedor.',
  },
  horarios: {
    titulo: 'Horarios de atención',
    texto: 'El comedor atiende de lunes a viernes de 8 a 20hs.',
  },
};

export default function AyudaCatchAllScreen() {
  // El catch-all puede entregar el slug como string (un solo segmento) o como
  // string[] (varios segmentos): se normaliza siempre a array antes de usarlo.
  const { slug } = useLocalSearchParams();
  const segmentos = Array.isArray(slug) ? slug : slug ? [slug] : [];
  const contenido = CONTENIDO_POR_SECCION[segmentos[0]];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.migas}>
          <Link href="/ayuda">
            <ThemedText type="link">Ayuda</ThemedText>
          </Link>
          {segmentos.map((segmento, indice) => (
            <ThemedText key={indice} type="small" themeColor="textSecondary">
              {' '}
              / {segmento}
            </ThemedText>
          ))}
        </View>

        {contenido ? (
          <>
            <ThemedText type="title">{contenido.titulo}</ThemedText>
            <ThemedText type="default" themeColor="textSecondary">
              {contenido.texto}
            </ThemedText>
          </>
        ) : (
          <ThemedText type="title">Artículo no encontrado</ThemedText>
        )}

        <DondeEstoy />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: 16, gap: 8 },
  migas: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
});
