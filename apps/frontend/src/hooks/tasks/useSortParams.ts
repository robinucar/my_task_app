import { useSearchParams } from 'react-router-dom';
import type { TaskSortBy, TaskSortOrder } from '@shared-types';

/**
 * Hook to manage sorting state via URL search params.
 *
 * Only supports 'status' and 'dueDate'. Defaults are handled by the backend.
 */
export const useSortParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const sortBy = searchParams.get('sortBy') as TaskSortBy | null;
  const sortOrder = searchParams.get('sortOrder') as TaskSortOrder | null;

  const toggleSort = (field: TaskSortBy) => {
    if (field !== sortBy) {
      setSearchParams({ sortBy: field, sortOrder: 'asc' });
    } else if (sortOrder === 'asc') {
      setSearchParams({ sortBy: field, sortOrder: 'desc' });
    } else {
      setSearchParams({});
    }
  };

  return { sortBy, sortOrder, toggleSort };
};
