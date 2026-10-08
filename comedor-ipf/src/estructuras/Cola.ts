/**
 * Cola (FIFO): el primer elemento encolado es el primero en salir.
 *
 * No usa array.shift() (sería O(n) en cada desencolado). En cambio, guarda un
 * índice privado #inicio que marca el frente y lo avanza al desencolar. Cuando
 * #inicio supera la mitad del largo del array, se compacta (se descartan los
 * huecos ya desencolados) para no acumular memoria indefinidamente.
 */
export class Cola<T> {
  #items: (T | undefined)[] = [];
  #inicio = 0;

  /** Encola un elemento al final. */
  encolar(x: T): void {
    this.#items.push(x);
  }

  /** Quita y devuelve el elemento del frente, o undefined si está vacía. */
  desencolar(): T | undefined {
    if (this.vacia) return undefined;

    const valor = this.#items[this.#inicio];
    // Se libera la referencia para que el recolector de basura pueda limpiarla.
    this.#items[this.#inicio] = undefined;
    this.#inicio++;
    this.#compactarSiCorresponde();

    return valor;
  }

  /** Devuelve el elemento del frente sin quitarlo, o undefined si está vacía. */
  frente(): T | undefined {
    return this.vacia ? undefined : this.#items[this.#inicio];
  }

  get vacia(): boolean {
    return this.#inicio >= this.#items.length;
  }

  get tamanio(): number {
    return this.#items.length - this.#inicio;
  }

  /** Copia del contenido, ordenada de frente a final. */
  aArray(): T[] {
    return this.#items.slice(this.#inicio) as T[];
  }

  #compactarSiCorresponde(): void {
    if (this.#inicio > this.#items.length / 2) {
      this.#items = this.#items.slice(this.#inicio);
      this.#inicio = 0;
    }
  }
}
