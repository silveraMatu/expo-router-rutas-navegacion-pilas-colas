import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DondeEstoy } from '@/components/DondeEstoy';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useApp } from '@/context/AppContext';

export default function TurnoScreen() {
  const { numero } = useLocalSearchParams<'/turno/[numero]'>();
  const { atendidos, posicionEnCola } = useApp();

  // El param de ruta llega como string: hay que convertirlo y validar que sea
  // un número real antes de usarlo para buscar el pedido.
  const idNumerico = Number(numero);
  const esValido = !Number.isNaN(idNumerico);
  const fueAtendido = esValido && atendidos.some((pedido) => pedido.numero === idNumerico);
  const posicion = esValido ? posicionEnCola(idNumerico) : -1;
  const enEspera = esValido && !fueAtendido && posicion !== -1;

  const volverAlInicio = () => {
    // dismissTo (no replace): "/" (el grupo (tabs)) ya está montado más abajo
    // en el Stack raíz desde que arrancó la app. dismissTo descarta las
    // pantallas de encima (este /turno, y /confirmar si todavía estuviera)
    // hasta volver a ESA entrada que ya existe. Si usáramos replace('/'),
    // en cambio, se apilaría una instancia NUEVA del grupo (tabs) arriba de
    // la vieja: /turno saldría del historial, pero quedaría un (tabs)
    // duplicado debajo, en vez de uno solo.
    router.dismissTo('/');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {!esValido && <ThemedText type="title">El turno no existe</ThemedText>}

        {esValido && fueAtendido && <ThemedText type="title">Tu pedido ya fue atendido</ThemedText>}

        {esValido && enEspera && (
          <>
            <ThemedText type="title">Tu turno: #{idNumerico}</ThemedText>
            <ThemedText type="default" themeColor="textSecondary">
              {posicion === 0
                ? 'Sos el próximo.'
                : `Hay ${posicion} pedido${posicion === 1 ? '' : 's'} adelante.`}
            </ThemedText>
          </>
        )}

        {esValido && !fueAtendido && !enEspera && <ThemedText type="title">El turno no existe</ThemedText>}

        <Pressable onPress={volverAlInicio} style={styles.boton}>
          <ThemedText type="link">Volver al inicio</ThemedText>
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
