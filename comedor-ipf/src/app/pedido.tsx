import { Redirect } from 'expo-router';

// "/pedido" es un alias histórico: redirige directo al carrito.
export default function PedidoScreen() {
  return <Redirect href="/carrito" />;
}
