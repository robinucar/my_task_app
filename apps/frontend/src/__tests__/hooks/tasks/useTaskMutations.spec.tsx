/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi } from 'vitest';
import { useTaskMutations } from '../../../hooks';
import api from '../../../lib/axios';
vi.mock('../../../lib/axios');

const mockedApi = api as unknown as {
  post: any;
  delete: any;
  put: any;
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
);

describe('useTaskMutations', () => {
  it('calls api.post when creating a task', async () => {
    mockedApi.post = vi.fn().mockResolvedValue({ data: { id: '1', title: 'Test' } });

    const { result } = renderHook(() => useTaskMutations(), { wrapper });

    await act(() => result.current.createTask.mutateAsync({ title: 'Test' }));

    expect(mockedApi.post).toHaveBeenCalledWith('/tasks', { title: 'Test' });
  });

  it('calls api.delete when deleting a task', async () => {
    mockedApi.delete = vi.fn().mockResolvedValue({});

    const { result } = renderHook(() => useTaskMutations(), { wrapper });

    await act(() => result.current.deleteTask.mutateAsync('123'));

    expect(mockedApi.delete).toHaveBeenCalledWith('/tasks/123');
  });

  it('calls api.put when updating a task', async () => {
    mockedApi.put = vi.fn().mockResolvedValue({ data: { id: '1', title: 'Updated' } });

    const { result } = renderHook(() => useTaskMutations(), { wrapper });

    await act(() => result.current.updateTask.mutateAsync({ id: '1', title: 'Updated' }));

    expect(mockedApi.put).toHaveBeenCalledWith('/tasks/1', { id: '1', title: 'Updated' });
  });
});
