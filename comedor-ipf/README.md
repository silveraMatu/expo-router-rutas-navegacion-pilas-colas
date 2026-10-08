# Comedor IPF

Trabajo práctico de la Tecnicatura en Desarrollo de Software (Instituto Politécnico Formosa).
Es una app de Expo Router para pedir comida en el comedor: simula el flujo completo (ver el
menú, armar un carrito, confirmar un pedido, sacar un turno) y el lado de cocina (atender
pedidos en orden). El eje del trabajo es **Expo Router** — rutas basadas en archivos,
navegadores anidados, rutas protegidas y deep links — y cómo esa navegación se apoya en dos
estructuras de datos propias: una **Pila** (LIFO) y una **Cola** (FIFO).

## 1. Descripción y cómo ejecutar

### Stack

- **Expo SDK 57** (`expo ~57.0.27`)
- **expo-router ~57.0.25** (misma mayor que el SDK)
- React Native 0.86.3, React 19.2.3
- TypeScript estricto, con rutas tipadas (`experiments.typedRoutes`)

### Ejecutar

Requiere Node y el SDK 57 de Expo (los paquetes ya están resueltos a esa versión en
`package.json`; no hace falta instalar nada global).

```bash
npm install
npx expo start
```

Desde la terminal que abre `expo start` podés elegir dónde correrlo:

- **w** → abre la versión web.
- Escanear el QR con la app **Expo Go** (Android/iOS) → sirve para navegar la app, pero **no**
  para probar el scheme propio ni rutas protegidas con deep link nativo (ver sección 5).
- `npx expo run:android` / `npx expo run:ios` → genera una build de desarrollo propia (necesaria
  para probar el scheme `comedoripf://` y notificaciones nativas reales).

Otros comandos útiles:

```bash
npx expo lint        # ESLint (incluye las reglas de React Compiler)
npx tsc --noEmit      # chequeo de tipos, sin emitir archivos
npx expo-doctor       # diagnóstico de dependencias/config
```

## 2. Árbol de rutas (`src/app`)

Cada `_layout.tsx` indica qué navegador monta. 🔒 = rama protegida con `Stack.Protected`.

```
src/app/
├── _layout.tsx                      Stack (raíz) — GestureHandlerRootView + AppProvider
│                                     screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}
│                                     unstable_settings = { anchor: '(tabs)' }
│   │
│   ├── (tabs)                        ← Stack.Screen, headerShown: false (rama pública)
│   │
│   ├── 🔒 cocina                     ← Stack.Protected guard={conSesion}
│   │
│   ├── 🔒 login (modal)              ← Stack.Protected guard={!conSesion}
│   │
│   ├── confirmar (modal)             ← Stack.Screen, sin protección
│   └── turno/[numero]                ← Stack.Screen, sin protección
│
├── (tabs)/_layout.tsx                Tabs (de 'expo-router/js-tabs') — índice, menú, carrito
│   ├── index.tsx                     "Inicio"
│   ├── menu/_layout.tsx              Stack anidado (la barra de tabs sigue visible)
│   │   ├── index.tsx                 "Menú" (SectionList por categoría)
│   │   └── [id].tsx                  "Plato" (detalle + agregar al carrito)
│   └── carrito/_layout.tsx           Stack anidado (la barra de tabs sigue visible)
│       ├── index.tsx                 "Carrito" (deshacer / confirmar)
│       └── nota.tsx                  "Nota del pedido"
│
├── categorias/[categoria].tsx        pública, en el Stack raíz
├── buscar.tsx                        pública, en el Stack raíz
│
├── 🔒 cocina/_layout.tsx             Drawer (de 'expo-router/drawer') — toda la sección
│   ├── index.tsx                     "Pedido actual" (frente de la cola + atender)
│   └── atendidos.tsx                 "Atendidos" (pila de pedidos atendidos)
│
├── 🔒 login.tsx                      formulario usuario/clave
│
├── turno/[numero].tsx                pública, en el Stack raíz
│
├── ayuda/
│   ├── index.tsx                     índice con links
│   └── [...slug].tsx                 catch-all (migas de pan + contenido de ejemplo)
│
├── pedido.tsx                        <Redirect href="/carrito" />
└── +not-found.tsx                    404 (muestra la URL inexistente)
```

`cocina` y `login` son las **únicas** ramas protegidas; todo lo demás (incluido `/confirmar` y
`/turno/[numero]`) es accesible sin sesión. Esto es intencional: confirmar un pedido y ver el
turno no requieren ser personal de cocina, solo *atenderlo* sí.

## 3. `replace` vs `push`: `/confirmar` → `/turno/[numero]`

En `src/app/confirmar.tsx` (líneas 15-25), al tocar "Confirmar":

```ts
const pedido = confirmarPedido();
router.replace({ pathname: '/turno/[numero]', params: { numero: pedido.numero } });
```

**Pila de navegación (el Stack raíz) antes de confirmar**, suponiendo que el usuario venía del
carrito:

```
['(tabs)', 'confirmar']        ← 'confirmar' se abrió con <Link href="/confirmar"> (push,
                                   porque esa ruta no estaba ya en el historial)
```

**Después de `router.replace(...)`:**

```
['(tabs)', 'turno/[numero]']   ← 'confirmar' fue SUSTITUIDA, no quedó una entrada nueva arriba
```

Si "atrás" se presiona desde `/turno/[numero]`, como `confirmar` ya no está en el historial, el
pop cae directo en `'(tabs)'` (con el carrito ya vacío).

**Qué pasaría con `push` en vez de `replace`:** la pila quedaría `['(tabs)', 'confirmar',
'turno/[numero]']`. "Atrás" desde el turno mostraría de nuevo la pantalla de confirmar, con el
botón **"Confirmar" todavía activo** — y como el carrito ya está vacío en ese punto, tocarlo de
nuevo llamaría a `confirmarPedido()` otra vez y generaría **un segundo pedido fantasma** (vacío,
pero con número de turno nuevo). `replace` evita ese bug de raíz: la pantalla que ya cumplió su
función desaparece del historial en vez de quedar ahí, lista para re-ejecutarse.

## 4. Pila y Cola: qué estructura usa cada cosa, y por qué

Las tres instancias viven en `src/context/AppContext.tsx` (líneas 71-73), como `useRef` (son
clases mutables; el porqué de eso está comentado ahí mismo, líneas 55-69):

| Caso de uso | Estructura | Por qué |
|---|---|---|
| **Deshacer** del carrito (`pilaDeshacerRef`, línea 71) | `Pila<Plato>` | Deshacer siempre tiene que revertir la **última** acción, nunca la primera. Ese es exactamente el contrato de una pila: `agregarAlCarrito` hace `push` (línea 94), `deshacerUltimo` hace `pop` (línea 100) y saca esa misma ocurrencia del carrito visible. Si el carrito tuviera [Milanesa, Agua, Milanesa] y el usuario deshace, tiene que desaparecer la **segunda** Milanesa (la última agregada), no la primera — una cola no podría expresar eso sin más lógica. |
| **Pedidos en espera** (`colaPedidosRef`, línea 72) | `Cola<Pedido>` | Acá el orden importa en el sentido opuesto: el primer pedido confirmado tiene que ser el primero en prepararse (orden de llegada = justicia). `confirmarPedido` hace `encolar` (línea 127) y `atenderSiguiente` hace `desencolar` (línea 141) sobre el **frente**, nunca sobre el que se confirmó más reciente. Por eso la consigna es tajante con "nadie se cuela": no hay ninguna función que permita atender otro pedido que no sea `frente()`. |
| **Pedidos atendidos** (`pilaAtendidosRef`, línea 73) | `Pila<Pedido>` (otra, distinta de la del carrito) | Acá se invierte el criterio de nuevo: la pantalla de "Atendidos" quiere mostrar el último atendido primero (como una pila de platos recién servidos, el de arriba es el que se sirvió último). `atenderSiguiente` hace `push` (línea 144) cada vez que sale uno de la cola, y el array que se expone (`atendidos`, línea 147) es `aArray()` **invertido**, porque la propia `Pila.aArray()` devuelve de la base al tope (`src/estructuras/Pila.ts`) y aquí se necesita lo opuesto (tope → base). |

Las tres clases están en `src/estructuras/` con campos privados reales (`#items` en ambas,
`#inicio` además en `Cola`), y `Cola` nunca usa `.shift()` — ver `src/estructuras/Cola.ts`.

## 5. Deep links de prueba

Reemplazá `<IP-LOCAL>` por la IP de tu máquina en la red local (la que muestra `expo start` al
arrancar, ej. `192.168.1.50`).

| Entorno | URL de prueba |
|---|---|
| **Expo Go** (QR / dev server) | `exp://<IP-LOCAL>:8081/--/menu/7` |
| **Build propia** (`expo run:android/ios` o instalada) | `comedoripf://menu/7` |
| **Web** | `http://localhost:8081/menu/7` |

### Qué significa el `/--/`

Expo Go es una sola app que puede alojar **cualquier** proyecto en desarrollo con solo apuntarla
a un host:puerto; necesita distinguir "a qué servidor de Metro conectarse" de "qué ruta pedirle a
*ese* proyecto una vez conectada". El separador `/--/` es justamente ese límite: todo lo que está
**antes** (`exp://<IP-LOCAL>:8081`) es la dirección del bundler; todo lo que está **después**
(`/menu/7`) es la ruta interna que expo-router debe resolver dentro de la app, exactamente igual
que si fuera `comedoripf://menu/7` en una build propia. (Documentación oficial: "In Expo Go,
`/--/` is added to the URL when a path is specified. This indicates to Expo Go that the substring
after it corresponds to the deep link path and is not part of the path to the app itself" —
`docs.expo.dev/linking/into-your-app`).

### Por qué `comedoripf://menu/7` NO abre nada en Expo Go

El scheme `comedoripf` (definido en `app.json`, clave `"scheme"`) recién queda **registrado ante
el sistema operativo** cuando generás tu propia build nativa (`expo run:android`/`run:ios`, o un
build de EAS) — ese registro pasa por `Info.plist`/`AndroidManifest.xml`, archivos que se generan
a partir de `app.json` en ese momento. Expo Go es un único binario genérico, ya instalado e
inmutable, que el sistema operativo solo asocia con **su propio** scheme (`exp://`); no tiene
forma de saber, en el momento de instalarse, que en el futuro vas a crear un proyecto llamado
"comedor-ipf" con scheme `comedoripf`. Por eso la documentación oficial recomienda directamente
usar builds de desarrollo para probar linking: "Support for incoming links in Expo Go is
limited. We recommend using Development builds to test your app's linking strategies."

## 6. Preguntas de la defensa oral

**1) ¿Qué método se usa para ir de `/confirmar` a `/turno/[numero]`, y qué pasaría con `push`?**
`router.replace(...)` — `src/app/confirmar.tsx:24`. Con `push` quedaría `confirmar` apilada
debajo del turno, "atrás" la volvería a mostrar con el botón "Confirmar" todavía funcional, y
tocarlo de nuevo generaría un segundo pedido (carrito ya vacío). Desarrollado en la sección 3 de
este README.

**2) ¿Qué pasa si cocina cierra sesión estando en `/cocina/atendidos`?**
`cerrarSesion` (`src/app/cocina/_layout.tsx:18-31`) solo llama a `logout()`, sin navegar a mano.
Como toda la sección `cocina` está protegida con `Stack.Protected guard={conSesion}`
(`src/app/_layout.tsx:33-35`), al pasar `conSesion` a `false` expo-router sacá automáticamente
**toda** esa rama del Stack — no solo la pantalla activa (`atendidos`), sino `cocina` entera,
incluida la entrada de `índice` que estaba debajo en su propio historial interno. El usuario cae
en lo que queda inmediatamente debajo en el Stack raíz: el grupo `(tabs)` (comprobado por HTTP:
pedir `/cocina/atendidos` sin sesión devuelve la pantalla de Inicio, no un crash ni una pantalla
en blanco). No queda ninguna pantalla de `cocina` en el historial para volver atrás a ella.

**3) ¿Por qué deshacer usa Pila y los pedidos usan Cola?**
Por el orden que cada operación necesita invertir o respetar: deshacer tiene que revertir lo
**último** hecho (LIFO), mientras que atender pedidos tiene que respetar el orden de llegada
(FIFO) — el primero en confirmar su pedido es el primero en ser atendido. Desarrollado con cita
de líneas en la sección 4.

**4) ¿Qué pasa con `comedoripf://menu/999` y `comedoripf://no-existe`?**
`/menu/999` sí matchea la ruta `menu/[id]` (`id="999"` es un string válido), pero
`obtenerPlatoPorId(999)` devuelve `undefined` porque solo existen los ids 1 a 14
(`src/data/platos.ts`) — la pantalla detecta eso (`src/app/(tabs)/menu/[id].tsx:14-19`) y
muestra "El plato no existe" con un link para volver al menú, sin crashear.
`/no-existe` no matchea **ningún** patrón de ruta registrado, así que expo-router resuelve
directamente a `src/app/+not-found.tsx`, que muestra la URL pedida (`usePathname()`) y un link a
`/`.

**5) ¿En qué orden se procesan las acciones de navegación si se tocan dos links seguidos?**
En orden estricto de llegada — y no es una metáfora: expo-router tiene una cola real para esto.
`node_modules/expo-router/build/global-state/routingQueue.js` guarda cada tap como una acción en
un array (`queue.push(action)` al tocar un link) y las procesa de una en una con
`events.shift()` cuando se ejecuta `run()`, llamando a `ref.current.dispatch(action)` para cada
una antes de pasar a la siguiente. Como cada dispatch se resuelve de forma sincrónica sobre el
estado de navegación que dejó el dispatch anterior, si tocás el Link A y enseguida el Link B, la
app navega primero a A y **desde ese resultado** procesa la navegación a B — nunca al revés, y
nunca se "pierde" ninguna de las dos. (Dato de color para la defensa: la cola interna de
expo-router usa `.shift()` para desencolar — algo que nuestra propia `Cola` evita a propósito por
ser O(n); a la escala de taps de un usuario no importa, pero es la clase de detalle que vale la
pena poder señalar.)

**6) Al abrir `/categorias/bebidas` por deep link, ¿qué pantalla queda debajo, y qué lo decide?**
Queda `(tabs)` (específicamente su pantalla índice, "Inicio") debajo de `categorias/bebidas` en
el Stack raíz. Lo decide `unstable_settings = { anchor: '(tabs)' }` en
`src/app/_layout.tsx:7-9`: ese `anchor` le dice al Stack cuál es su `initialRouteName`, y
expo-router garantiza que esa ruta ancla se cargue debajo de **cualquier** ruta a la que se entre
directamente por deep link (confirmado en el código fuente de la librería,
`getNavigationAction.js`, comentario "Set initial on root and all nested params so anchors are
loaded at every level"). Sin ese `anchor`, un deep link directo a una pantalla profunda dejaría
el Stack con una sola entrada y "atrás" saldría de la app en vez de volver a algo útil.

## 7. Capturas

_(pendientes — agregar en `docs/capturas/` y enlazar acá)_

- `![Carrito con deshacer](docs/capturas/carrito-deshacer.png)` — carrito con 2-3 ítems y el
  botón "Deshacer último" habilitado, mostrando el tamaño de la pila.
- `![Turno asignado](docs/capturas/turno.png)` — `/turno/[numero]` mostrando "Tu turno: #N" y la
  posición en la cola.
- `![Cocina atendiendo](docs/capturas/cocina-atendiendo.png)` — `/cocina` con un pedido en el
  frente y el botón "Atender siguiente".
- `![Login y logout](docs/capturas/login-logout.png)` — el modal de `/login` y el drawer de
  `/cocina` con "Cerrar sesión".
- `![404](docs/capturas/404.png)` — `+not-found` mostrando una URL inexistente.

## 8. Credenciales de prueba (cocina)

```
Usuario: cocina
Clave:   ipf2025
```

Definidas en `src/context/AppContext.tsx:7-10` (fijas, sin backend — alcance de esta entrega).
