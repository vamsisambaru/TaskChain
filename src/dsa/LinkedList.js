/**
 * Singly Linked List — primary store for tasks.
 * O(1) prepend/append (with tail pointer), O(n) removal by id.
 * Each node holds a Task payload; UI consumes toArray() snapshots.
 */

class LinkedListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  append(value) {
    const node = new LinkedListNode(value);
    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this.size += 1;
    return node;
  }

  prepend(value) {
    const node = new LinkedListNode(value);
    node.next = this.head;
    this.head = node;
    if (!this.tail) this.tail = node;
    this.size += 1;
    return node;
  }

  removeById(id) {
    if (!this.head) return null;
    if (this.head.value.id === id) {
      const removed = this.head;
      this.head = this.head.next;
      if (!this.head) this.tail = null;
      this.size -= 1;
      return removed.value;
    }
    let prev = this.head;
    while (prev.next && prev.next.value.id !== id) {
      prev = prev.next;
    }
    if (!prev.next) return null;
    const removed = prev.next;
    prev.next = removed.next;
    if (removed === this.tail) this.tail = prev;
    this.size -= 1;
    return removed.value;
  }

  updateById(id, patch) {
    let cur = this.head;
    while (cur) {
      if (cur.value.id === id) {
        cur.value = { ...cur.value, ...patch };
        return cur.value;
      }
      cur = cur.next;
    }
    return null;
  }

  findById(id) {
    let cur = this.head;
    while (cur) {
      if (cur.value.id === id) return cur.value;
      cur = cur.next;
    }
    return null;
  }

  toArray() {
    const out = [];
    let cur = this.head;
    while (cur) {
      out.push(cur.value);
      cur = cur.next;
    }
    return out;
  }

  static fromArray(values) {
    const list = new LinkedList();
    values.forEach((v) => list.append(v));
    return list;
  }

  clear() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }
}

export { LinkedListNode };
export default LinkedList;
