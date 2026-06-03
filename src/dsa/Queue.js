/**
 * Circular Queue — bounded ring for recent activity / completed tasks feed.
 * O(1) enqueue/dequeue without array shift.
 */

class Queue {
  constructor(capacity = 50) {
    this.capacity = capacity;
    this.items = new Array(capacity);
    this.head = 0;
    this.tail = 0;
    this.count = 0;
  }

  enqueue(value) {
    this.items[this.tail] = value;
    this.tail = (this.tail + 1) % this.capacity;
    if (this.count === this.capacity) {
      this.head = (this.head + 1) % this.capacity;
    } else {
      this.count += 1;
    }
  }

  dequeue() {
    if (this.count === 0) return null;
    const value = this.items[this.head];
    this.items[this.head] = undefined;
    this.head = (this.head + 1) % this.capacity;
    this.count -= 1;
    return value;
  }

  peek() {
    return this.count === 0 ? null : this.items[this.head];
  }

  get size() {
    return this.count;
  }

  isEmpty() {
    return this.count === 0;
  }

  clear() {
    this.items = new Array(this.capacity);
    this.head = 0;
    this.tail = 0;
    this.count = 0;
  }

  toArray() {
    const out = [];
    for (let i = 0; i < this.count; i += 1) {
      out.push(this.items[(this.head + i) % this.capacity]);
    }
    return out;
  }
}

export default Queue;
