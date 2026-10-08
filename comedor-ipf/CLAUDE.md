# Comedor IPF — reglas del proyecto

Trabajo práctico de la Tecnicatura en Desarrollo de Software (Instituto Politécnico Formosa),
centrado en Expo Router (rutas basadas en archivos y navegación) y su relación con las
estructuras de datos Pila y Cola.

Stack: Expo SDK 57, expo-router ~57 (misma versión mayor que el SDK), TypeScript estricto.

## Reglas obligatorias

- En `src/app` solo van archivos de ruta y `_layout`; nunca componentes reutilizables.
  Los componentes van en `src/components`.
- Los params de ruta (`useLocalSearchParams`) llegan siempre como `string` (o `string[]`):
  siempre validar/convertir antes de usarlos como número, booleano, etc.
- Usar `<Link>` cuando la navegación ocurre porque el usuario toca algo en la UI; usar `router`
  (de `expo-router`) cuando se navega como consecuencia de lógica (por ejemplo, tras una
  validación o una acción sobre la Pila/Cola).
- Ningún `href` escrito a mano puede tener errores de TypeScript (rutas tipadas activas via
  `experiments.typedRoutes` en `app.json`). Nunca usar `as any` para esquivar el tipado de rutas.
- Pila y Cola (`src/estructuras`) se implementan con campo privado `#items`. La Cola NO debe
  usar `shift()` (es O(n)); usar una estrategia O(1) (por ejemplo, dos punteros o un buffer
  circular).
- Tabs se importan de `'expo-router/js-tabs'` (no de `expo-router/unstable-native-tabs` ni de
  `expo-router/ui`). Drawer se importa de `'expo-router/drawer'`.
- Paquetes se instalan SOLO con `npx expo install <paquete>` (nunca `npm install` /
  `yarn add` / `pnpm add` / `bun add`), para respetar las versiones compatibles con el SDK.
- Antes de usar cualquier API de Expo/expo-router que no se haya verificado en esta conversación,
  revisar los tipos reales en `node_modules/expo-router` (o el paquete correspondiente) y/o la
  documentación oficial versionada (`docs.expo.dev/versions/v57.0.0/`). No asumir comportamientos
  de versiones anteriores del SDK.
- La UI (textos visibles) y los comentarios del código van en español.
- Después de cada tarea, correr `npx tsc --noEmit` y `npx expo lint`, y corregir los errores
  antes de continuar.

## Estructura de carpetas

```
src/
  app/          rutas y _layout (Expo Router)
  components/   componentes de UI reutilizables
  data/         datos estáticos / mocks
  estructuras/  Pila y Cola (y otras estructuras de datos)
  context/      contextos de React
  constants/    constantes de tema, etc.
  hooks/        hooks reutilizables
```
