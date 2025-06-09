import React from 'react';
import { useTasks } from '../hooks/useTasks';
import { Task } from '@shared-types';
import './TaskList.css'; // Make sure this file exists

interface TaskListProps {
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ onEdit, onDelete }) => {
  const { data: tasks = [], isLoading, isError } = useTasks();

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
          {tasks.map((task) => (
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
