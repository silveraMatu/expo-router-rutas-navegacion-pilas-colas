import { Ionicons } from '@expo/vector-icons';
import { Link, type Href } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type TarjetaAccesoProps = {
  href: Href;
  icono: keyof typeof Ionicons.glyphMap;
  titulo: string;
};

/** Tarjeta de acceso rápido usada en la pantalla de Inicio. */
export function TarjetaAcceso({ href, icono, titulo }: TarjetaAccesoProps) {
  return (
    <Link href={href} asChild>
      <Pressable style={({ pressed }) => [styles.tarjeta, pressed && styles.presionada]}>
        <ThemedView type="backgroundElement" style={styles.contenido}>
          <Ionicons name={icono} size={28} />
          <ThemedText type="smallBold">{titulo}</ThemedText>
        </ThemedView>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    width: '47%',
  },
  presionada: {
    opacity: 0.7,
  },
  contenido: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 24,
    borderRadius: 16,
  },
});
