import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import type { Task } from '@shared-types';

/**
 * Hook for create, update, and delete task mutations.
 * Automatically invalidates the 'tasks' query on success.
 */
export const useTaskMutations = () => {
  const queryClient = useQueryClient();

  const createTask = useMutation({
    mutationFn: async (newTask: Partial<Task>) => {
      const res = await api.post('/tasks', newTask);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (taskId: string) => {
      await api.delete(`/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const updateTask = useMutation({
    mutationFn: async (updatedTask: Partial<Task> & { id: string }) => {
      const res = await api.put(`/tasks/${updatedTask.id}`, updatedTask);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return { createTask, deleteTask, updateTask };
};
