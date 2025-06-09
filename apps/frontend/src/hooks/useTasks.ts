import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Task } from '@shared-types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetches the list of tasks from the backend API.
 *
 * Sends a GET request to `${API_BASE_URL}/tasks` and returns the data
 * as an array of `Task` objects.
 *
 * @returns {Promise<Task[]>} A promise that resolves to an array of tasks.
 */
const fetchTasks = async (): Promise<Task[]> => {
  const response = await axios.get(`${API_BASE_URL}/tasks`);
  return response.data;
};

/**
 * React Query hook to fetch and cache the list of tasks.
 * @returns {UseQueryResult<Task[], Error>} The result object containing data,
 * loading state, and error (if any).
 */
export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });
};
