import React from 'react';
import { useTasks } from '../../hooks/useTasks';
import { Task } from '@shared-types';
import { Loading } from '../Loading/Loading';
import { ErrorMessage } from '../Error/ErrorMessage';
import { formatDate, formatDescription } from '../../utils/formatUtils';
import './TaskList.css';

type TaskSortBy = 'dueDate' | 'status';

interface TaskListProps {
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ onEdit, onDelete }) => {
  const { data: tasks = [], isLoading, isError, sortBy, sortOrder, toggleSort } = useTasks();

  const renderSortIndicator = (field: TaskSortBy) => {
    if (sortBy !== field) return '';
    return sortOrder === 'asc' ? ' ▲' : ' ▼';
  };

  const getAriaSort = (field: TaskSortBy): 'ascending' | 'descending' | 'none' => {
    if (sortBy !== field) return 'none';
    return sortOrder === 'asc' ? 'ascending' : 'descending';
  };

  const handleSortKeyDown = (e: React.KeyboardEvent, field: TaskSortBy) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleSort(field);
    }
  };

  if (isLoading) {
    return (
      <div className="task-message" role="status" aria-live="polite">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="task-message" role="status" aria-live="assertive">
        <ErrorMessage message="Failed to load tasks." />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-message" role="status" aria-live="polite">
        <ErrorMessage message="No tasks found." />
      </div>
    );
  }

  return (
    <div className="task-table-container">
      <table className="task-table" aria-label="Task list">
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Description</th>
            <th
              scope="col"
              tabIndex={0}
              onClick={() => toggleSort('dueDate')}
              onKeyDown={(e) => handleSortKeyDown(e, 'dueDate')}
              aria-sort={getAriaSort('dueDate')}
              style={{ cursor: 'pointer' }}
            >
              Due Date{renderSortIndicator('dueDate')}
            </th>
            <th
              scope="col"
              tabIndex={0}
              onClick={() => toggleSort('status')}
              onKeyDown={(e) => handleSortKeyDown(e, 'status')}
              aria-sort={getAriaSort('status')}
              style={{ cursor: 'pointer' }}
            >
              Status{renderSortIndicator('status')}
            </th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} data-testid={`task-row-${task.id}`}>
              <td>{task.title}</td>
              <td>{formatDescription(task.description)}</td>
              <td>{formatDate(task.dueDate)}</td>
              <td>{task.status}</td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => onEdit(task)}
                  aria-label={`Edit task titled "${task.title}"`}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => onDelete(task)}
                  aria-label={`Delete task titled "${task.title}"`}
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
