import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
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
    // Esqueleto: todavía sin confirmación ni limpieza del resto de la sesión.
    logout();
    router.replace('/login');
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
