import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import type { Task } from '@shared-types';

/**
 * Hook for create, update, and delete task mutations.
 * Automatically invalidates the 'tasks' query on success.
 */
export const useTaskMutations = () => {
  const queryClient = useQueryClient();

  // Create Task: returns Task, accepts Partial<Task>
  const createTask = useMutation<Task, Error, Partial<Task>>({
    mutationFn: async (newTask) => {
      const res = await api.post('/tasks', newTask);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Delete Task: returns void, accepts string (taskId)
  const deleteTask = useMutation<void, Error, string>({
    mutationFn: async (taskId) => {
      if (!taskId) {
        throw new Error('❌ Cannot delete task: ID is missing');
      }
      await api.delete(`/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Update Task: returns Task, accepts Partial<Task> with id
  const updateTask = useMutation<Task, Error, Partial<Task> & { id: string }>({
    mutationFn: async (updatedTask) => {
      const res = await api.put(`/tasks/${updatedTask.id}`, updatedTask);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return { createTask, deleteTask, updateTask };
};
