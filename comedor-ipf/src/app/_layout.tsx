import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useColorScheme } from 'react-native';

import { AppProvider, useApp } from '@/context/AppContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <RootNavigator />
      </AppProvider>
    </GestureHandlerRootView>
  );
}

// Componente interno (no exportado): necesita leer el contexto para decidir los
// guards de Stack.Protected, y el contexto solo está disponible dentro de AppProvider.
function RootNavigator() {
  const colorScheme = useColorScheme();
  const { usuario } = useApp();
  const conSesion = usuario !== null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        <Stack.Protected guard={conSesion}>
          <Stack.Screen name="cocina" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Protected guard={!conSesion}>
          <Stack.Screen name="login" options={{ presentation: 'modal' }} />
        </Stack.Protected>

        <Stack.Screen name="confirmar" options={{ presentation: 'modal' }} />
        <Stack.Screen name="turno/[numero]" />
      </Stack>
    </ThemeProvider>
  );
}
