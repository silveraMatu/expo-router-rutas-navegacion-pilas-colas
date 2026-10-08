/** Categorías del menú del comedor. */
export type Categoria = 'desayuno' | 'almuerzo' | 'bebidas' | 'kiosco';

export const CATEGORIAS: Categoria[] = ['desayuno', 'almuerzo', 'bebidas', 'kiosco'];

export type Plato = {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  categoria: Categoria;
};

export const PLATOS: Plato[] = [
  // Desayuno
  {
    id: 1,
    nombre: 'Café con leche',
    precio: 800,
    descripcion: 'Café con leche caliente, taza grande',
    categoria: 'desayuno',
  },
  {
    id: 2,
    nombre: 'Tostado de jamón y queso',
    precio: 1500,
    descripcion: 'Pan de miga tostado con jamón y queso',
    categoria: 'desayuno',
  },
  {
    id: 3,
    nombre: 'Medialunas (x2)',
    precio: 700,
    descripcion: 'Dos medialunas de manteca',
    categoria: 'desayuno',
  },
  {
    id: 4,
    nombre: 'Mate cocido',
    precio: 500,
    descripcion: 'Mate cocido con o sin azúcar',
    categoria: 'desayuno',
  },

  // Almuerzo
  {
    id: 5,
    nombre: 'Milanesa con puré',
    precio: 3200,
    descripcion: 'Milanesa de carne con puré de papas',
    categoria: 'almuerzo',
  },
  {
    id: 6,
    nombre: 'Pollo al horno con ensalada',
    precio: 3000,
    descripcion: 'Pollo al horno con ensalada mixta',
    categoria: 'almuerzo',
  },
  {
    id: 7,
    nombre: 'Tarta de verdura',
    precio: 2500,
    descripcion: 'Tarta de acelga y queso, porción grande',
    categoria: 'almuerzo',
  },
  {
    id: 8,
    nombre: 'Guiso de lentejas',
    precio: 2800,
    descripcion: 'Guiso de lentejas con chorizo',
    categoria: 'almuerzo',
  },

  // Bebidas
  {
    id: 9,
    nombre: 'Agua mineral 500ml',
    precio: 900,
    descripcion: 'Agua mineral sin gas, botella 500ml',
    categoria: 'bebidas',
  },
  {
    id: 10,
    nombre: 'Gaseosa línea Coca-Cola 500ml',
    precio: 1200,
    descripcion: 'Gaseosa a elección, botella 500ml',
    categoria: 'bebidas',
  },
  {
    id: 11,
    nombre: 'Jugo de naranja natural',
    precio: 1000,
    descripcion: 'Jugo de naranja exprimido, vaso grande',
    categoria: 'bebidas',
  },

  // Kiosco
  {
    id: 12,
    nombre: 'Alfajor Jorgito',
    precio: 600,
    descripcion: 'Alfajor de chocolate triple',
    categoria: 'kiosco',
  },
  {
    id: 13,
    nombre: 'Barrita de cereal',
    precio: 500,
    descripcion: 'Barrita de cereal con frutos secos',
    categoria: 'kiosco',
  },
  {
    id: 14,
    nombre: 'Papas fritas Lays',
    precio: 900,
    descripcion: 'Papas fritas, paquete individual',
    categoria: 'kiosco',
  },
];

export function obtenerPlatoPorId(id: number): Plato | undefined {
  return PLATOS.find((plato) => plato.id === id);
}

export function platosPorCategoria(cat: Categoria): Plato[] {
  return PLATOS.filter((plato) => plato.categoria === cat);
}

export function esCategoriaValida(valor: string): valor is Categoria {
  return (CATEGORIAS as string[]).includes(valor);
}
