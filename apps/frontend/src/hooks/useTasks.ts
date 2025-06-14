import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import type { Task } from '@shared-types';
import { useSortParams } from './tasks/useSortParams';
import { useTaskMutations } from './tasks/useTaskMutations';

/**
 * Fetches the list of tasks from the backend with optional sorting parameters.
 *
 * @param sortBy - The field to sort by ('dueDate' or 'status')
 * @param sortOrder - The order to sort ('asc' or 'desc')
 * @returns A promise resolving to an array of Task objects.
 */
const fetchTasks = async (sortBy?: string, sortOrder?: string): Promise<Task[]> => {
  const params: Record<string, string> = {};
  if (sortBy) params.sortBy = sortBy;
  if (sortOrder) params.sortOrder = sortOrder;

  const response = await api.get('/tasks', { params });
  return response.data;
};

/**
 * Custom hook that handles:
 * - Fetching tasks from the API (with optional sorting)
 * - Mutating tasks (create, update, delete)
 * - Managing sorting state via URL parameters
 *
 * @returns An object containing task data, mutation functions, and sorting controls.
 */
export const useTasks = () => {
  const { sortBy, sortOrder, toggleSort } = useSortParams();
  const { createTask, deleteTask, updateTask } = useTaskMutations();

  const queryResult = useQuery<Task[], Error>({
    queryKey: ['tasks', sortBy, sortOrder],
    queryFn: () => fetchTasks(sortBy ?? undefined, sortOrder ?? undefined),
  });

  return {
    ...queryResult, // includes: data, isLoading, isError, error, etc.
    createTask, // useMutation for creating a task
    deleteTask, // useMutation for deleting a task
    updateTask, // useMutation for updating a task
    sortBy, // current sort field
    sortOrder, // current sort order
    toggleSort, // function to change sort field/order
  };
};
