import { Stack } from 'expo-router';

// La barra de tabs (definida en el _layout de (tabs)) sigue visible: este Stack
// anidado solo controla la navegación dentro de la pestaña "Menú".
export default function MenuLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Menú' }} />
      <Stack.Screen name="[id]" options={{ title: 'Plato' }} />
    </Stack>
  );
}
