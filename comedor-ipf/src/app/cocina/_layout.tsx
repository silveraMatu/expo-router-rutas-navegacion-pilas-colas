import { Ionicons } from '@expo/vector-icons';
import {
  Drawer,
  DrawerContentScrollView,
  DrawerItemList,
  type DrawerContentComponentProps,
} from 'expo-router/drawer';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useApp } from '@/context/AppContext';

// Componente interno (no exportado): el contenido personalizado del Drawer no es
// una ruta, pero expo-router/drawer necesita un componente para renderizarlo.
function CocinaDrawerContent(props: DrawerContentComponentProps) {
  const { logout } = useApp();

  const cerrarSesion = () => {
    // Solo logout(): no navegamos a mano. "cocina" está protegida con
    // Stack.Protected guard={conSesion}; al cerrar sesión, conSesion pasa a
    // false y expo-router saca automáticamente toda la sección cocina del
    // Stack (cae en la pantalla de abajo, el grupo (tabs), sin dejar rastro
    // en el historial). Si en cambio hiciéramos router.replace/back() justo
    // acá, competiríamos con esa actualización declarativa del guard: el
    // Stack todavía no terminó de aplicar el cambio de ruta protegida cuando
    // nuestra llamada imperativa intentaría apuntar a una pantalla que, desde
    // el estado previo del navegador, no estaba registrada — eso es
    // exactamente lo que produce el aviso "NAVIGATE... was not handled by
    // any navigator".
    logout();
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <Pressable onPress={cerrarSesion} style={styles.cerrarSesion}>
        <Ionicons name="log-out-outline" size={20} />
        <ThemedText type="default">Cerrar sesión</ThemedText>
      </Pressable>
    </DrawerContentScrollView>
  );
}

export default function CocinaLayout() {
  return (
    <Drawer drawerContent={(props) => <CocinaDrawerContent {...props} />}>
      <Drawer.Screen name="index" options={{ title: 'Pedido actual' }} />
      <Drawer.Screen name="atendidos" options={{ title: 'Atendidos' }} />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  cerrarSesion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
