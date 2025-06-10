import React, { useState } from 'react';
import { Task, TaskStatus } from '@shared-types';
import { useTasks } from '../../hooks/useTasks';
import './CreateTaskForm.css';

interface CreateTaskFormProps {
  onSuccess: () => void;
  initialValues?: Partial<Task> & { id?: string };
}

export const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ onSuccess, initialValues }) => {
  const { createTask, updateTask } = useTasks();

  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [dueDate, setDueDate] = useState(
    initialValues?.dueDate ? new Date(initialValues.dueDate).toISOString().split('T')[0] : '',
  );
  const [status, setStatus] = useState<TaskStatus>(initialValues?.status || TaskStatus.PENDING);

  const isEditing = !!initialValues?.id;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      id: initialValues?.id,
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate?.trim() ? new Date(dueDate) : undefined,
      status,
    };

    const mutation = isEditing ? updateTask : createTask;

    mutation.mutate(payload as any, {
      onSuccess: () => {
        if (!isEditing) {
          setTitle('');
          setDescription('');
          setDueDate('');
          setStatus(TaskStatus.PENDING);
        }
        onSuccess();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="task-form" aria-labelledby="create-task-heading">
      <h2 id="create-task-heading">{isEditing ? 'Edit Task' : 'Create Task'}</h2>

      <div className="form-group">
        <label htmlFor="title">
          Title <span aria-hidden="true">*</span>
        </label>
        <input
          id="title"
          type="text"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description (optional)</label>
        <textarea
          id="description"
          placeholder="Enter task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="dueDate">Due Date (optional)</label>
        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
        >
          {Object.values(TaskStatus).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="form-buttons">
        <button
          type="submit"
          disabled={(isEditing ? updateTask.status : createTask.status) === 'pending'}
        >
          {(isEditing ? updateTask.status : createTask.status) === 'pending'
            ? isEditing
              ? 'Updating...'
              : 'Creating...'
            : isEditing
              ? 'Update Task'
              : 'Create Task'}
        </button>
        <button type="button" className="cancel-button" onClick={onSuccess}>
          Cancel
        </button>
      </div>
    </form>
  );
};
