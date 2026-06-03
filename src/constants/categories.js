export const CATEGORIES = [
  { id: 'work', label: 'Work', color: '#7C5CFF', icon: 'briefcase' },
  { id: 'personal', label: 'Personal', color: '#FF6BCB', icon: 'heart' },
  { id: 'health', label: 'Health', color: '#3DDC97', icon: 'activity' },
  { id: 'study', label: 'Study', color: '#5CCFFF', icon: 'book-open' },
  { id: 'errand', label: 'Errands', color: '#FFB454', icon: 'shopping-bag' },
  { id: 'idea', label: 'Ideas', color: '#9C7BFF', icon: 'zap' },
];

export const PRIORITIES = [
  { id: 'high', label: 'High', color: '#FF5C7A' },
  { id: 'medium', label: 'Medium', color: '#FFB454' },
  { id: 'low', label: 'Low', color: '#3DDC97' },
];

export const SORT_MODES = [
  { id: 'smart', label: 'Smart' },
  { id: 'due', label: 'Due Date' },
  { id: 'priority', label: 'Priority' },
  { id: 'created', label: 'Recent' },
  { id: 'title', label: 'A–Z' },
];

export const FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'today', label: 'Today' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
];

export const getCategory = (id) =>
  CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];

export const getPriority = (id) =>
  PRIORITIES.find((p) => p.id === id) || PRIORITIES[1];
