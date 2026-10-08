import { Stack } from 'expo-router';

// La barra de tabs (definida en el _layout de (tabs)) sigue visible: este Stack
// anidado solo controla la navegación dentro de la pestaña "Carrito".
export default function CarritoLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Carrito' }} />
      <Stack.Screen name="nota" options={{ title: 'Nota del pedido' }} />
    </Stack>
  );
}
