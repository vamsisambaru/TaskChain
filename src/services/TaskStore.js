/**
 * TaskStore — singleton facade that owns the live DSA structures.
 *
 * Why a singleton outside Redux?
 *   - LinkedList/Stack/Queue instances aren't serializable; Redux state must be.
 *   - The store holds the source of truth; Redux holds rendered SNAPSHOTS.
 *   - Slices call into TaskStore, then dispatch the resulting snapshot.
 */

import {
  LinkedList,
  Stack,
  Queue,
  PriorityQueue,
  sortByDueDate,
  sortByPriority,
  sortByCreatedAt,
  sortByTitle,
  computeScore,
} from '../dsa';

class TaskStore {
  constructor() {
    this.list = new LinkedList();
    this.undoStack = new Stack(50);
    this.activityQueue = new Queue(50);
  }

  hydrate(tasks = [], activity = []) {
    this.list = LinkedList.fromArray(tasks);
    this.undoStack = new Stack(50);
    this.activityQueue = new Queue(50);
    activity.slice(-50).forEach((a) => this.activityQueue.enqueue(a));
  }

  add(task) {
    this.list.prepend(task);
    this.activityQueue.enqueue({
      id: `act-${task.id}`,
      type: 'created',
      taskId: task.id,
      title: task.title,
      at: Date.now(),
    });
  }

  update(id, patch) {
    const updated = this.list.updateById(id, patch);
    if (updated && patch.completed === true) {
      this.activityQueue.enqueue({
        id: `act-c-${id}-${Date.now()}`,
        type: 'completed',
        taskId: id,
        title: updated.title,
        at: Date.now(),
      });
    }
    return updated;
  }

  remove(id) {
    const removed = this.list.removeById(id);
    if (removed) {
      this.undoStack.push(removed);
      this.activityQueue.enqueue({
        id: `act-d-${id}-${Date.now()}`,
        type: 'deleted',
        taskId: id,
        title: removed.title,
        at: Date.now(),
      });
    }
    return removed;
  }

  undoDelete() {
    const restored = this.undoStack.pop();
    if (restored) {
      this.list.prepend(restored);
      this.activityQueue.enqueue({
        id: `act-r-${restored.id}-${Date.now()}`,
        type: 'restored',
        taskId: restored.id,
        title: restored.title,
        at: Date.now(),
      });
    }
    return restored;
  }

  reorder(orderedIds) {
    const map = new Map();
    this.list.toArray().forEach((t) => map.set(t.id, t));
    this.list.clear();
    orderedIds.forEach((id) => {
      const t = map.get(id);
      if (t) this.list.append(t);
    });
  }

  toArray() {
    return this.list.toArray();
  }

  activity() {
    return this.activityQueue.toArray().reverse();
  }

  undoSize() {
    return this.undoStack.size;
  }

  smartQueue() {
    return PriorityQueue.from(
      this.list.toArray().filter((t) => !t.completed),
      computeScore,
    ).toSortedArray();
  }

  sorted(mode) {
    const arr = this.list.toArray();
    switch (mode) {
      case 'due':
        return sortByDueDate(arr);
      case 'priority':
        return sortByPriority(arr);
      case 'created':
        return sortByCreatedAt(arr);
      case 'title':
        return sortByTitle(arr);
      case 'smart':
        return this.smartQueue().concat(arr.filter((t) => t.completed));
      default:
        return arr;
    }
  }
}

const taskStore = new TaskStore();
export default taskStore;
