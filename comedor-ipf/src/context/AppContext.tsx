import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';

import { Cola, Pila } from '@/estructuras';
import type { Plato } from '@/data/platos';

/** Credenciales fijas para esta entrega (no hay backend de autenticación todavía). */
const CREDENCIALES = {
  usuario: 'cocina',
  clave: 'ipf2025',
} as const;

export type Pedido = {
  numero: number;
  items: Plato[];
  total: number;
  nota: string;
  creadoEn: Date;
};

type AppContextValue = {
  // Sesión
  usuario: string | null;
  login: (usuario: string, clave: string) => boolean;
  logout: () => void;

  // Carrito
  items: Plato[];
  total: number;
  agregarAlCarrito: (plato: Plato) => void;
  deshacerUltimo: () => void;
  puedeDeshacer: boolean;
  /** Tamaño de la pila de deshacer (fines didácticos: cuántos "agregar" se pueden revertir). */
  tamanioPilaDeshacer: number;
  vaciarCarrito: () => void;
  nota: string;
  setNota: (nota: string) => void;

  // Cola de pedidos
  confirmarPedido: () => Pedido;
  pedidoEnFrente: Pedido | undefined;
  cantidadEnEspera: number;
  atenderSiguiente: () => void;
  posicionEnCola: (numero: number) => number;
  atendidos: Pedido[];
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<string | null>(null);
  const [items, setItems] = useState<Plato[]>([]);
  const [nota, setNota] = useState('');
  const [contador, setContador] = useState(1);

  /**
   * Pila y Cola son clases con estado mutable "por dentro" (#items, #inicio):
   * push/pop/encolar/desencolar cambian su contenido pero NO la referencia del
   * objeto. Si las leyéramos directamente durante el render (por ejemplo en un
   * useMemo que llama a pila.vacia o cola.frente()), React no tiene forma de
   * saber que debe volver a renderizar cuando mutan, y además el linter de
   * React Compiler lo prohíbe ("Cannot access refs during render").
   *
   * Por eso las instancias viven en useRef (se mantienen estables entre
   * renders, sin recrearse) y SOLO se leen o mutan dentro de los manejadores
   * (push/pop, agregarAlCarrito, etc.), nunca durante el render. Cada
   * manejador, después de mutar la estructura, copia el dato derivado que le
   * interesa a un snapshot en useState (puedeDeshacer, pedidoEnFrente,
   * cantidadEnEspera, atendidos). Esos sí son estados reales: al actualizarlos
   * React vuelve a renderizar con los valores correctos.
   */
  const pilaDeshacerRef = useRef(new Pila<Plato>());
  const colaPedidosRef = useRef(new Cola<Pedido>());
  const pilaAtendidosRef = useRef(new Pila<Pedido>());

  const [tamanioPilaDeshacer, setTamanioPilaDeshacer] = useState(0);
  const puedeDeshacer = tamanioPilaDeshacer > 0;
  const [pedidoEnFrente, setPedidoEnFrente] = useState<Pedido | undefined>(undefined);
  const [cantidadEnEspera, setCantidadEnEspera] = useState(0);
  const [atendidos, setAtendidos] = useState<Pedido[]>([]);

  const login = useCallback((usuarioIngresado: string, claveIngresada: string): boolean => {
    if (usuarioIngresado === CREDENCIALES.usuario && claveIngresada === CREDENCIALES.clave) {
      setUsuario(usuarioIngresado);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => setUsuario(null), []);

  const total = useMemo(() => items.reduce((acumulado, plato) => acumulado + plato.precio, 0), [items]);

  const agregarAlCarrito = useCallback((plato: Plato) => {
    pilaDeshacerRef.current.push(plato);
    setItems((prev) => [...prev, plato]);
    setTamanioPilaDeshacer(pilaDeshacerRef.current.tamanio);
  }, []);

  const deshacerUltimo = useCallback(() => {
    const plato = pilaDeshacerRef.current.pop();
    if (plato === undefined) return;

    setItems((prev) => {
      const indice = prev.lastIndexOf(plato);
      if (indice === -1) return prev;
      return [...prev.slice(0, indice), ...prev.slice(indice + 1)];
    });
    setTamanioPilaDeshacer(pilaDeshacerRef.current.tamanio);
  }, []);

  const vaciarCarrito = useCallback(() => {
    pilaDeshacerRef.current = new Pila<Plato>();
    setItems([]);
    setNota('');
    setTamanioPilaDeshacer(0);
  }, []);

  const confirmarPedido = useCallback((): Pedido => {
    const pedido: Pedido = {
      numero: contador,
      items,
      total,
      nota,
      creadoEn: new Date(),
    };

    colaPedidosRef.current.encolar(pedido);
    pilaDeshacerRef.current = new Pila<Plato>();

    setContador((n) => n + 1);
    setItems([]);
    setNota('');
    setTamanioPilaDeshacer(0);
    setPedidoEnFrente(colaPedidosRef.current.frente());
    setCantidadEnEspera(colaPedidosRef.current.tamanio);

    return pedido;
  }, [contador, items, nota, total]);

  const atenderSiguiente = useCallback(() => {
    const pedido = colaPedidosRef.current.desencolar();
    if (pedido === undefined) return;

    pilaAtendidosRef.current.push(pedido);
    setPedidoEnFrente(colaPedidosRef.current.frente());
    setCantidadEnEspera(colaPedidosRef.current.tamanio);
    setAtendidos([...pilaAtendidosRef.current.aArray()].reverse());
  }, []);

  const posicionEnCola = useCallback((numero: number): number => {
    return colaPedidosRef.current.aArray().findIndex((pedido) => pedido.numero === numero);
  }, []);

  const value: AppContextValue = {
    usuario,
    login,
    logout,
    items,
    total,
    agregarAlCarrito,
    deshacerUltimo,
    puedeDeshacer,
    tamanioPilaDeshacer,
    vaciarCarrito,
    nota,
    setNota,
    confirmarPedido,
    pedidoEnFrente,
    cantidadEnEspera,
    atenderSiguiente,
    posicionEnCola,
    atendidos,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (context === null) {
    throw new Error('useApp debe usarse dentro de un AppProvider');
  }
  return context;
}
