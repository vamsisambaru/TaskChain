/**
 * Stable Merge Sort — used to sort tasks by due date or priority.
 * O(n log n) worst case; stable order preserves user-entered order on ties.
 */

const merge = (left, right, compare) => {
  const out = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (compare(left[i], right[j]) <= 0) {
      out.push(left[i]);
      i += 1;
    } else {
      out.push(right[j]);
      j += 1;
    }
  }
  while (i < left.length) {
    out.push(left[i]);
    i += 1;
  }
  while (j < right.length) {
    out.push(right[j]);
    j += 1;
  }
  return out;
};

export const mergeSort = (arr, compare = (a, b) => (a < b ? -1 : a > b ? 1 : 0)) => {
  if (arr.length <= 1) return arr.slice();
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid), compare);
  const right = mergeSort(arr.slice(mid), compare);
  return merge(left, right, compare);
};

const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };

export const sortByDueDate = (tasks, direction = 'asc') => {
  const sign = direction === 'asc' ? 1 : -1;
  return mergeSort(tasks, (a, b) => {
    const aDue = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
    const bDue = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
    return sign * (aDue - bDue);
  });
};

export const sortByPriority = (tasks) =>
  mergeSort(tasks, (a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]);

export const sortByCreatedAt = (tasks, direction = 'desc') => {
  const sign = direction === 'asc' ? 1 : -1;
  return mergeSort(tasks, (a, b) => sign * (a.createdAt - b.createdAt));
};

export const sortByTitle = (tasks) =>
  mergeSort(tasks, (a, b) => a.title.localeCompare(b.title));

export default mergeSort;
