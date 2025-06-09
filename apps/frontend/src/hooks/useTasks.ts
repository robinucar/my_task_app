import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Task } from '@shared-types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type SortField = 'createdAt' | 'dueDate' | 'status';
type SortOrder = 'asc' | 'desc';

export const useTasks = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const sortBy = (searchParams.get('sortBy') as SortField) || 'createdAt';
  const sortOrder = (searchParams.get('sortOrder') as SortOrder) || 'desc';

  const toggleSort = (field: SortField) => {
    if (field !== sortBy) {
      setSearchParams({ sortBy: field, sortOrder: 'asc' });
    } else if (sortOrder === 'asc') {
      setSearchParams({ sortBy: field, sortOrder: 'desc' });
    } else {
      setSearchParams({ sortBy: 'createdAt', sortOrder: 'desc' });
    }
  };

  const fetchTasks = async (): Promise<Task[]> => {
    const response = await axios.get(`${API_BASE_URL}/tasks`, {
      params: { sortBy, sortOrder },
    });
    return response.data;
  };

  const tasksQuery = useQuery({
    queryKey: ['tasks', sortBy, sortOrder],
    queryFn: fetchTasks,
  });

  const createTask = useMutation<any, Error, Partial<Task>>({
    mutationFn: async (newTask) => {
      const res = await axios.post(`${API_BASE_URL}/tasks`, newTask);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteTask = useMutation<void, Error, string>({
    mutationFn: async (taskId) => {
      await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const updateTask = useMutation<any, Error, Partial<Task> & { id: string }>({
    mutationFn: async (updatedTask) => {
      const res = await axios.put(`${API_BASE_URL}/tasks/${updatedTask.id}`, updatedTask);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    ...tasksQuery,
    createTask,
    deleteTask,
    updateTask,
    sortBy,
    sortOrder,
    toggleSort,
  };
};
