import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { DoublyLinkedList } from '../dsa';
import { selectFilteredTasks } from '../redux/selectors';

/**
 * Navigation helper for TaskDetails — wraps the visible task list
 * in a DoublyLinkedList so prev/next is O(1).
 */
const useTaskNavigator = (currentId) => {
  const items = useSelector(selectFilteredTasks);
  return useMemo(() => {
    const dll = DoublyLinkedList.fromArray(items);
    return {
      next: dll.next(currentId),
      prev: dll.prev(currentId),
      total: dll.size,
      indexOf: items.findIndex((t) => t.id === currentId),
    };
  }, [items, currentId]);
};

export default useTaskNavigator;
