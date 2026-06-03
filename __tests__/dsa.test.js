import LinkedList from '../src/dsa/LinkedList';
import DoublyLinkedList from '../src/dsa/DoublyLinkedList';
import Stack from '../src/dsa/Stack';
import Queue from '../src/dsa/Queue';
import { mergeSort, sortByPriority, sortByDueDate } from '../src/dsa/MergeSort';
import PriorityQueue, { computeScore } from '../src/dsa/PriorityQueue';

describe('LinkedList', () => {
  test('append/prepend/remove preserve order and size', () => {
    const list = new LinkedList();
    list.append({ id: 'a' });
    list.append({ id: 'b' });
    list.prepend({ id: 'z' });
    expect(list.toArray().map((t) => t.id)).toEqual(['z', 'a', 'b']);
    list.removeById('a');
    expect(list.size).toBe(2);
    expect(list.toArray().map((t) => t.id)).toEqual(['z', 'b']);
  });
  test('updateById merges patch', () => {
    const list = LinkedList.fromArray([{ id: 'a', completed: false }]);
    list.updateById('a', { completed: true });
    expect(list.findById('a').completed).toBe(true);
  });
});

describe('DoublyLinkedList', () => {
  test('next/prev navigation', () => {
    const dll = DoublyLinkedList.fromArray([{ id: 'a' }, { id: 'b' }, { id: 'c' }]);
    expect(dll.next('a').id).toBe('b');
    expect(dll.prev('c').id).toBe('b');
    expect(dll.prev('a')).toBe(null);
    expect(dll.next('c')).toBe(null);
  });
});

describe('Stack', () => {
  test('LIFO order with capacity', () => {
    const s = new Stack(3);
    s.push(1);
    s.push(2);
    s.push(3);
    s.push(4);
    expect(s.toArray()).toEqual([2, 3, 4]);
    expect(s.pop()).toBe(4);
    expect(s.size).toBe(2);
  });
});

describe('Queue', () => {
  test('FIFO order with bounded ring', () => {
    const q = new Queue(3);
    q.enqueue('a');
    q.enqueue('b');
    q.enqueue('c');
    q.enqueue('d');
    expect(q.toArray()).toEqual(['b', 'c', 'd']);
    expect(q.dequeue()).toBe('b');
  });
});

describe('MergeSort', () => {
  test('sorts integers stably', () => {
    expect(mergeSort([5, 1, 4, 2, 3])).toEqual([1, 2, 3, 4, 5]);
  });
  test('sortByPriority orders high → medium → low', () => {
    const tasks = [
      { id: 1, priority: 'low' },
      { id: 2, priority: 'high' },
      { id: 3, priority: 'medium' },
    ];
    expect(sortByPriority(tasks).map((t) => t.id)).toEqual([2, 3, 1]);
  });
  test('sortByDueDate handles null dueDate (pushed to end)', () => {
    const a = { id: 1, dueDate: null };
    const b = { id: 2, dueDate: new Date(Date.now() + 86400000).toISOString() };
    expect(sortByDueDate([a, b]).map((t) => t.id)).toEqual([2, 1]);
  });
});

describe('PriorityQueue', () => {
  test('peek returns minimum-score task', () => {
    const tasks = [
      { id: 1, priority: 'low', dueDate: null },
      { id: 2, priority: 'high', dueDate: new Date(Date.now() + 1000).toISOString() },
      { id: 3, priority: 'medium', dueDate: new Date(Date.now() + 86400000).toISOString() },
    ];
    const pq = PriorityQueue.from(tasks, computeScore);
    expect(pq.peek().id).toBe(2);
  });
  test('toSortedArray drains in priority order', () => {
    const tasks = [
      { id: 'lo', priority: 'low', dueDate: null },
      { id: 'hi', priority: 'high', dueDate: null },
      { id: 'md', priority: 'medium', dueDate: null },
    ];
    const sorted = PriorityQueue.from(tasks, computeScore).toSortedArray();
    expect(sorted.map((t) => t.id)).toEqual(['hi', 'md', 'lo']);
  });
});
