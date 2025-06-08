import { sortTasks } from '../../utils/sortTask';
import { TaskStatus } from '@prisma/client';
import { mockTaskList, mockTasksWithNullDueDate } from '../__mocks__/task.mock';
describe('sortTasks', () => {
  it('returns unsorted array if sortBy is undefined or invalid', () => {
    const result = sortTasks(mockTaskList, 'invalidSortKey' as never);
    expect(result.map((t) => t.id)).toEqual(['1', '2', '3']);
  });

  it('sorts by dueDate ascending by default when specified', () => {
    const result = sortTasks(mockTaskList, 'dueDate', 'asc');
    expect(result.map((t) => t.id)).toEqual(['2', '1', '3']);
  });

  it('sorts by dueDate descending', () => {
    const result = sortTasks(mockTaskList, 'dueDate', 'desc');
    expect(result.map((t) => t.id)).toEqual(['3', '1', '2']);
  });

  it('sorts by status ascending', () => {
    const result = sortTasks(mockTaskList, 'status', 'asc');
    expect(result.map((t) => t.status)).toEqual([
      TaskStatus.PENDING,
      TaskStatus.IN_PROGRESS,
      TaskStatus.COMPLETED,
    ]);
  });

  it('sorts by status descending', () => {
    const result = sortTasks(mockTaskList, 'status', 'desc');
    expect(result.map((t) => t.status)).toEqual([
      TaskStatus.COMPLETED,
      TaskStatus.IN_PROGRESS,
      TaskStatus.PENDING,
    ]);
  });
  it('sorts by dueDate ascending and places nulls at the end', () => {
    const result = sortTasks(mockTasksWithNullDueDate, 'dueDate', 'asc');
    expect(result.map((t) => t.id)).toEqual(['2', '1', '3', '4']);
  });

  it('sorts by dueDate descending and places nulls at the end', () => {
    const result = sortTasks(mockTasksWithNullDueDate, 'dueDate', 'desc');
    expect(result.map((t) => t.id)).toEqual(['3', '1', '2', '4']);
  });
  it('defaults to ascending when sortOrder is undefined', () => {
    const result = sortTasks(mockTaskList, 'dueDate');
    expect(result.map((t) => t.id)).toEqual(['2', '1', '3']);
  });
});
