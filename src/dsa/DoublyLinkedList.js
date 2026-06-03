/**
 * Doubly Linked List — used for task navigation (next/prev) inside TaskDetails.
 * Carrying both pointers makes O(1) sibling traversal trivial.
 */

class DoublyLinkedListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  append(value) {
    const node = new DoublyLinkedListNode(value);
    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      node.prev = this.tail;
      this.tail.next = node;
      this.tail = node;
    }
    this.size += 1;
    return node;
  }

  findNodeById(id) {
    let cur = this.head;
    while (cur) {
      if (cur.value.id === id) return cur;
      cur = cur.next;
    }
    return null;
  }

  next(id) {
    const node = this.findNodeById(id);
    return node && node.next ? node.next.value : null;
  }

  prev(id) {
    const node = this.findNodeById(id);
    return node && node.prev ? node.prev.value : null;
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
    const list = new DoublyLinkedList();
    values.forEach((v) => list.append(v));
    return list;
  }
}

export { DoublyLinkedListNode };
export default DoublyLinkedList;
