/**
 * Stack — backs the undo-delete feature.
 * Each delete pushes the removed task; user pops to restore.
 */

class Stack {
  constructor(capacity = Infinity) {
    this.items = [];
    this.capacity = capacity;
  }

  push(value) {
    this.items.push(value);
    if (this.items.length > this.capacity) {
      this.items.shift();
    }
    return this.items.length;
  }

  pop() {
    return this.items.length ? this.items.pop() : null;
  }

  peek() {
    return this.items.length ? this.items[this.items.length - 1] : null;
  }

  get size() {
    return this.items.length;
  }

  isEmpty() {
    return this.items.length === 0;
  }

  clear() {
    this.items = [];
  }

  toArray() {
    return [...this.items];
  }
}

export default Stack;
