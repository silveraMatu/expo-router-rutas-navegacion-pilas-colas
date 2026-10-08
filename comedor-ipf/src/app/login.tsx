import { useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DondeEstoy } from '@/components/DondeEstoy';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useApp } from '@/context/AppContext';

export default function LoginScreen() {
  const { login } = useApp();
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState(false);

  const ingresar = () => {
    const ok = login(usuario, clave);
    setError(!ok);
    // Si login() tiene éxito no llamamos a router.back() ni router.replace():
    // esta pantalla está protegida con Stack.Protected guard={!conSesion}.
    // login() exitoso cambia "usuario" en el contexto, lo que hace que
    // conSesion pase a true y el guard de "login" pase a false; expo-router
    // saca automáticamente esa ruta del Stack (el modal se cierra solo, en la
    // misma actualización de estado). Navegar nosotros a mano justo en este
    // momento competiría con esa actualización declarativa del guard y es
    // la causa típica del aviso "NAVIGATE... was not handled by any navigator".
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title">Iniciar sesión</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Acceso para el personal de cocina.
        </ThemedText>

        <TextInput
          value={usuario}
          onChangeText={setUsuario}
          placeholder="Usuario"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />
        <TextInput
          value={clave}
          onChangeText={setClave}
          placeholder="Clave"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />

        {error && (
          <ThemedText type="small" themeColor="textSecondary">
            Usuario o clave incorrectos.
          </ThemedText>
        )}

        <Pressable onPress={ingresar} style={styles.boton}>
          <ThemedText type="link">Ingresar</ThemedText>
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
  },
  boton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(128,128,128,0.15)',
  },
});
