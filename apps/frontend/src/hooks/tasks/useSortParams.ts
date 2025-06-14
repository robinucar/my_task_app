import { useSearchParams } from 'react-router-dom';
import type { TaskSortBy, TaskSortOrder } from '@shared-types';

/**
 * Type guard to validate sortBy values
 */
const isSortBy = (value: unknown): value is TaskSortBy => value === 'status' || value === 'dueDate';

/**
 * Type guard to validate sortOrder values
 */
const isSortOrder = (value: unknown): value is TaskSortOrder => value === 'asc' || value === 'desc';

/**
 * Hook to manage sorting state via URL search params.
 *
 * Supports sorting by 'status' or 'dueDate', with 'asc' or 'desc' order.
 */
export const useSortParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const sortByParam = searchParams.get('sortBy');
  const sortOrderParam = searchParams.get('sortOrder');

  const sortBy = isSortBy(sortByParam) ? sortByParam : null;
  const sortOrder = isSortOrder(sortOrderParam) ? sortOrderParam : null;

  const toggleSort = (field: TaskSortBy) => {
    const newParams = new URLSearchParams(searchParams);

    if (field !== sortBy) {
      newParams.set('sortBy', field);
      newParams.set('sortOrder', 'asc');
    } else if (sortOrder === 'asc') {
      newParams.set('sortOrder', 'desc');
    } else {
      newParams.delete('sortBy');
      newParams.delete('sortOrder');
    }

    setSearchParams(newParams);
  };

  return { sortBy, sortOrder, toggleSort };
};
