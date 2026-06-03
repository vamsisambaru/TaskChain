/**
 * Min-Heap Priority Queue — picks the next "smart priority" task in O(log n).
 * Score = priorityWeight + dueDateUrgency; lower score = higher priority.
 */

const PRIORITY_WEIGHT = { high: 0, medium: 50, low: 100 };
const DAY_MS = 24 * 60 * 60 * 1000;

const dueUrgency = (dueDate) => {
  if (!dueDate) return 200;
  const diffDays = (new Date(dueDate).getTime() - Date.now()) / DAY_MS;
  if (diffDays < 0) return -100;
  if (diffDays < 1) return 0;
  if (diffDays < 3) return 10;
  if (diffDays < 7) return 30;
  return 60;
};

export const computeScore = (task) =>
  PRIORITY_WEIGHT[task.priority] + dueUrgency(task.dueDate);

class PriorityQueue {
  constructor(scoreFn = computeScore) {
    this.heap = [];
    this.scoreFn = scoreFn;
  }

  get size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  peek() {
    return this.heap[0] || null;
  }

  enqueue(value) {
    this.heap.push(value);
    this._bubbleUp(this.heap.length - 1);
  }

  dequeue() {
    if (this.heap.length === 0) return null;
    const top = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._sinkDown(0);
    }
    return top;
  }

  toSortedArray() {
    const clone = new PriorityQueue(this.scoreFn);
    clone.heap = [...this.heap];
    const out = [];
    while (!clone.isEmpty()) out.push(clone.dequeue());
    return out;
  }

  _score(node) {
    return this.scoreFn(node);
  }

  _bubbleUp(idx) {
    let i = idx;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this._score(this.heap[i]) < this._score(this.heap[parent])) {
        [this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]];
        i = parent;
      } else break;
    }
  }

  _sinkDown(idx) {
    const n = this.heap.length;
    let i = idx;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smallest = i;
      if (left < n && this._score(this.heap[left]) < this._score(this.heap[smallest])) {
        smallest = left;
      }
      if (right < n && this._score(this.heap[right]) < this._score(this.heap[smallest])) {
        smallest = right;
      }
      if (smallest !== i) {
        [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
        i = smallest;
      } else break;
    }
  }

  static from(tasks, scoreFn = computeScore) {
    const pq = new PriorityQueue(scoreFn);
    tasks.forEach((t) => pq.enqueue(t));
    return pq;
  }
}

export default PriorityQueue;
