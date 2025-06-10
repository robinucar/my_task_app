import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import api from '../../lib/axios';
import { useTasks } from '../../hooks';

vi.mock('../../lib/axios');
vi.mock('../../hooks/tasks/useSortParams', () => ({
  useSortParams: () => ({
    sortBy: 'dueDate',
    sortOrder: 'asc',
    toggleSort: vi.fn(),
  }),
}));
vi.mock('../../hooks/tasks/useTaskMutations', () => ({
  useTaskMutations: () => ({
    createTask: { mutate: vi.fn() },
    deleteTask: { mutate: vi.fn() },
    updateTask: { mutate: vi.fn() },
  }),
}));

const mockedApi = api as unknown as { get: any };

const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MemoryRouter>
  );
};

describe('useTasks', () => {
  beforeEach(() => {
    mockedApi.get = vi.fn().mockResolvedValue({
      data: [{ id: '1', title: 'Sample Task', status: 'PENDING' }],
    });
  });

  it('fetches tasks with sort params', async () => {
    const { result } = renderHook(() => useTasks(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedApi.get).toHaveBeenCalledWith(
      expect.stringContaining('/tasks'),
      expect.objectContaining({
        params: { sortBy: 'dueDate', sortOrder: 'asc' },
      }),
    );

    expect(result.current.data).toEqual([{ id: '1', title: 'Sample Task', status: 'PENDING' }]);
  });
});
