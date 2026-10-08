/** Pila (LIFO): el último elemento apilado es el primero en salir. */
export class Pila<T> {
  #items: T[] = [];

  /** Apila un elemento en el tope. */
  push(x: T): void {
    this.#items.push(x);
  }

  /** Quita y devuelve el elemento del tope, o undefined si está vacía. */
  pop(): T | undefined {
    return this.#items.pop();
  }

  /** Devuelve el elemento del tope sin quitarlo, o undefined si está vacía. */
  tope(): T | undefined {
    return this.#items[this.#items.length - 1];
  }

  get vacia(): boolean {
    return this.#items.length === 0;
  }

  get tamanio(): number {
    return this.#items.length;
  }

  /** Copia del contenido, ordenada de la base al tope. */
  aArray(): T[] {
    return [...this.#items];
  }
}
