/**
 * Script de verificación manual de Pila y Cola. No es un framework de testing:
 * se ejecuta con `npx tsx src/estructuras/__pruebas__.ts` y reporta por consola.
 */
import assert from 'node:assert/strict';

import { Cola, Pila } from './index';

type Prueba = { nombre: string; ejecutar: () => void };

const pruebas: Prueba[] = [
  {
    nombre: 'Pila: orden LIFO',
    ejecutar: () => {
      const pila = new Pila<number>();
      pila.push(1);
      pila.push(2);
      pila.push(3);
      assert.equal(pila.pop(), 3);
      assert.equal(pila.pop(), 2);
      assert.equal(pila.pop(), 1);
    },
  },
  {
    nombre: 'Cola: orden FIFO',
    ejecutar: () => {
      const cola = new Cola<number>();
      cola.encolar(1);
      cola.encolar(2);
      cola.encolar(3);
      assert.equal(cola.desencolar(), 1);
      assert.equal(cola.desencolar(), 2);
      assert.equal(cola.desencolar(), 3);
    },
  },
  {
    nombre: 'Pila y Cola: vacía',
    ejecutar: () => {
      const pila = new Pila<string>();
      assert.equal(pila.vacia, true);
      assert.equal(pila.pop(), undefined);
      assert.equal(pila.tope(), undefined);
      pila.push('a');
      assert.equal(pila.vacia, false);
      pila.pop();
      assert.equal(pila.vacia, true);

      const cola = new Cola<string>();
      assert.equal(cola.vacia, true);
      assert.equal(cola.desencolar(), undefined);
      assert.equal(cola.frente(), undefined);
      cola.encolar('a');
      assert.equal(cola.vacia, false);
      cola.desencolar();
      assert.equal(cola.vacia, true);
    },
  },
  {
    nombre: 'Pila y Cola: tamaño',
    ejecutar: () => {
      const pila = new Pila<number>();
      assert.equal(pila.tamanio, 0);
      pila.push(1);
      pila.push(2);
      assert.equal(pila.tamanio, 2);
      pila.pop();
      assert.equal(pila.tamanio, 1);

      const cola = new Cola<number>();
      assert.equal(cola.tamanio, 0);
      cola.encolar(1);
      cola.encolar(2);
      assert.equal(cola.tamanio, 2);
      cola.desencolar();
      assert.equal(cola.tamanio, 1);
    },
  },
  {
    nombre: 'aArray devuelve una copia (mutarla no afecta la estructura)',
    ejecutar: () => {
      const pila = new Pila<number>();
      pila.push(1);
      pila.push(2);
      pila.push(3);
      const copiaPila = pila.aArray();
      assert.deepEqual(copiaPila, [1, 2, 3]);
      copiaPila.push(999);
      copiaPila[0] = -1;
      assert.deepEqual(pila.aArray(), [1, 2, 3]);
      assert.equal(pila.tamanio, 3);

      const cola = new Cola<number>();
      cola.encolar(1);
      cola.encolar(2);
      cola.encolar(3);
      const copiaCola = cola.aArray();
      assert.deepEqual(copiaCola, [1, 2, 3]);
      copiaCola.push(999);
      copiaCola[0] = -1;
      assert.deepEqual(cola.aArray(), [1, 2, 3]);
      assert.equal(cola.tamanio, 3);
    },
  },
  {
    nombre: 'Cola: aArray se ordena de frente a final tras desencolar',
    ejecutar: () => {
      const cola = new Cola<number>();
      cola.encolar(1);
      cola.encolar(2);
      cola.encolar(3);
      cola.desencolar();
      assert.deepEqual(cola.aArray(), [2, 3]);
      assert.equal(cola.frente(), 2);
    },
  },
  {
    nombre: 'Pila: 10.000 elementos (LIFO, tamaño y aArray consistentes)',
    ejecutar: () => {
      const pila = new Pila<number>();
      const N = 10_000;
      for (let i = 0; i < N; i++) pila.push(i);
      assert.equal(pila.tamanio, N);
      assert.deepEqual(pila.aArray(), Array.from({ length: N }, (_, i) => i));

      for (let i = N - 1; i >= 0; i--) {
        assert.equal(pila.pop(), i);
      }
      assert.equal(pila.vacia, true);
      assert.equal(pila.pop(), undefined);
    },
  },
  {
    nombre: 'Cola: 10.000 elementos (FIFO, tamaño, compactación y aArray consistentes)',
    ejecutar: () => {
      const cola = new Cola<number>();
      const N = 10_000;
      for (let i = 0; i < N; i++) cola.encolar(i);
      assert.equal(cola.tamanio, N);
      assert.deepEqual(cola.aArray(), Array.from({ length: N }, (_, i) => i));

      // Encolar y desencolar intercalado: fuerza varias compactaciones internas
      // (cuando #inicio supera la mitad del largo del array).
      for (let i = 0; i < N; i++) {
        assert.equal(cola.desencolar(), i);
        cola.encolar(N + i);
      }
      assert.equal(cola.tamanio, N);
      assert.deepEqual(cola.aArray(), Array.from({ length: N }, (_, i) => N + i));

      for (let i = 0; i < N; i++) {
        assert.equal(cola.desencolar(), N + i);
      }
      assert.equal(cola.vacia, true);
      assert.equal(cola.desencolar(), undefined);
    },
  },
];

let fallidas = 0;

for (const { nombre, ejecutar } of pruebas) {
  try {
    ejecutar();
    console.log(`✅ ${nombre}`);
  } catch (error) {
    fallidas++;
    console.error(`❌ ${nombre}`);
    console.error(error);
  }
}

console.log(`\n${pruebas.length - fallidas}/${pruebas.length} pruebas OK`);

if (fallidas > 0) {
  process.exit(1);
}
