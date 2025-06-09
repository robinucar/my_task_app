import React from 'react';
import { useTasks } from '../hooks/useTasks';
import { Task } from '@shared-types';
import './TaskList.css';

type SortBy = 'status' | 'dueDate' | 'createdAt';
type SortOrder = 'asc' | 'desc';

interface TaskListProps {
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  sortBy: SortBy | null;
  sortOrder: SortOrder;
  toggleSort: (field: SortBy) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  onEdit,
  onDelete,
  sortBy,
  sortOrder,
  toggleSort,
}) => {
  const { data: tasks = [], isLoading, isError } = useTasks();

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }

    if (sortBy === 'status') {
      const order = { PENDING: 1, IN_PROGRESS: 2, COMPLETED: 3 };
      const valA = order[a.status];
      const valB = order[b.status];
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    }

    if (sortBy === 'createdAt') {
      const createdA = new Date(a.createdAt).getTime();
      const createdB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? createdA - createdB : createdB - createdA;
    }

    return 0;
  });

  if (isLoading) return <p className="task-message">Loading tasks...</p>;
  if (isError) return <p className="task-message error">Failed to load tasks.</p>;
  if (tasks.length === 0) return <p className="task-message">No tasks found.</p>;

  return (
    <div className="task-table-container">
      <table className="task-table" aria-label="Task list">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedTasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.description || '—'}</td>
              <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}</td>
              <td>{task.status}</td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => onEdit(task)}
                  aria-label={`Edit ${task.title}`}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => onDelete(task.id)}
                  aria-label={`Delete ${task.title}`}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
