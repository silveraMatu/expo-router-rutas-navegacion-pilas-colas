import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DondeEstoy } from '@/components/DondeEstoy';
import { TarjetaAcceso } from '@/components/TarjetaAcceso';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useApp } from '@/context/AppContext';

export default function InicioScreen() {
  const { usuario } = useApp();
  const conSesion = usuario !== null;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title">Hola 👋</ThemedText>
        <ThemedText type="default" themeColor="textSecondary">
          Bienvenido al comedor del IPF
        </ThemedText>

        <View style={styles.grilla}>
          <TarjetaAcceso href="/menu" icono="restaurant" titulo="Menú" />
          <TarjetaAcceso href="/buscar" icono="search" titulo="Buscar" />
          <TarjetaAcceso href="/ayuda" icono="help-circle" titulo="Ayuda" />
          {/* /cocina no existe sin sesión: si no hay sesión, lleva a /login. */}
          <TarjetaAcceso href={conSesion ? '/cocina' : '/login'} icono="flame" titulo="Cocina" />
        </View>

        <DondeEstoy />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: 16, gap: 16 },
  grilla: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
});
