import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DondeEstoy } from '@/components/DondeEstoy';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useApp } from '@/context/AppContext';

export default function NotaScreen() {
  const { nota, setNota } = useApp();
  const [texto, setTexto] = useState(nota);

  const guardarYVolver = () => {
    setNota(texto);
    // back() y no push/replace: esta pantalla es un paso intermedio sobre el
    // carrito (se abrió desde ahí con router.push al tocar "Agregar nota"),
    // no una sección nueva. Con back() volvemos a la pantalla que ya estaba
    // en el historial (el carrito) sin apilar una entrada repetida; si en
    // cambio usáramos push('/carrito'), quedaría nota -> carrito -> carrito
    // apilado dos veces, y el botón atrás del dispositivo requeriría un toque
    // extra para salir de la tab. canGoBack() cubre el caso en que a esta
    // pantalla se llegó sin historial previo (por ejemplo, abriendo el link
    // directo en la web), donde back() no tendría a dónde volver.
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/carrito');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title">Nota del pedido</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Una aclaración para la cocina, por ejemplo &quot;sin sal&quot;.
        </ThemedText>

        <TextInput
          value={texto}
          onChangeText={setTexto}
          multiline
          numberOfLines={4}
          placeholder="Ej: sin sal, bien cocida..."
          style={styles.input}
        />

        <Pressable onPress={guardarYVolver} style={styles.boton}>
          <ThemedText type="link">Guardar</ThemedText>
        </Pressable>

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
    minHeight: 100,
    textAlignVertical: 'top',
  },
  boton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(128,128,128,0.15)',
  },
});
