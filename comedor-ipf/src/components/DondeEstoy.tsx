import { useLocalSearchParams, usePathname, useSegments } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

/**
 * Cambiar a `false` para ocultar este panel de depuración en todas las pantallas
 * (se agrega al final de cada una para entender rutas, segmentos y params de Expo Router).
 */
export const DEBUG = true;

export function DondeEstoy() {
  const pathname = usePathname();
  const segments = useSegments();
  const params = useLocalSearchParams();

  if (!DEBUG) return null;

  return (
    <View style={styles.container}>
      <ThemedText type="smallBold" themeColor="textSecondary">
        🧭 Dónde estoy
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        pathname: <ThemedText type="code">{pathname}</ThemedText>
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        segments: <ThemedText type="code">{JSON.stringify(segments)}</ThemedText>
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        params: <ThemedText type="code">{JSON.stringify(params)}</ThemedText>
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 'auto',
    gap: 4,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128,128,128,0.3)',
  },
});
