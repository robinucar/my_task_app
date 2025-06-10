import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useSortParams } from '../../../hooks';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>
);

describe('useSortParams', () => {
  it('returns nulls when no query params are set', () => {
    const { result } = renderHook(() => useSortParams(), { wrapper });

    expect(result.current.sortBy).toBeNull();
    expect(result.current.sortOrder).toBeNull();
  });

  it('sets sort params when toggled', () => {
    const { result } = renderHook(() => useSortParams(), { wrapper });

    act(() => {
      result.current.toggleSort('dueDate');
    });

    expect(result.current.sortBy).toBe('dueDate');
    expect(result.current.sortOrder).toBe('asc');

    act(() => {
      result.current.toggleSort('dueDate');
    });

    expect(result.current.sortOrder).toBe('desc');

    act(() => {
      result.current.toggleSort('dueDate');
    });

    expect(result.current.sortBy).toBeNull();
    expect(result.current.sortOrder).toBeNull();
  });
});
