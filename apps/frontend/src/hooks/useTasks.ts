import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import { Task } from '@shared-types';
import { useSortParams } from './tasks/useSortParams';
import { useTaskMutations } from './tasks/useTaskMutations';

export const useTasks = () => {
  const { sortBy, sortOrder, toggleSort } = useSortParams();
  const { createTask, deleteTask, updateTask } = useTaskMutations();

  const fetchTasks = async (): Promise<Task[]> => {
    const params: Record<string, string> = {};
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;

    const response = await api.get('/tasks', { params });
    return response.data;
  };

  const { data, isLoading, isError, error, isSuccess, refetch, ...rest } = useQuery({
    queryKey: ['tasks', sortBy, sortOrder],
    queryFn: fetchTasks,
  });

  return {
    data,
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
    ...rest,
    createTask,
    deleteTask,
    updateTask,
    sortBy,
    sortOrder,
    toggleSort,
  };
};
