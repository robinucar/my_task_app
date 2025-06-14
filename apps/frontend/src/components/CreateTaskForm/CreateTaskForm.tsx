import React from 'react';
import { Task, TaskStatus } from '@shared-types';
import { useTasks } from '../../hooks/useTasks';
import { useTaskFormState } from '../../hooks/useTaskFormState';
import { ErrorMessage } from '../Error/ErrorMessage';
import './CreateTaskForm.css';

interface CreateTaskFormProps {
  onSuccess: () => void;
  initialValues?: Partial<Task> & { id?: string };
}

export const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ onSuccess, initialValues }) => {
  const { createTask, updateTask } = useTasks();
  const {
    title,
    setTitle,
    description,
    setDescription,
    dueDate,
    setDueDate,
    status,
    setStatus,
    errors,
    validateAndBuildPayload,
    resetForm,
  } = useTaskFormState(initialValues);

  const isEditing = !!initialValues?.id;
  const isPending = (isEditing ? updateTask.status : createTask.status) === 'pending';
  const buttonText = isPending
    ? isEditing
      ? 'Updating...'
      : 'Creating...'
    : isEditing
      ? 'Update Task'
      : 'Create Task';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = validateAndBuildPayload();

    if (!payload) return;

    if (isEditing) {
      if ('id' in payload) {
        updateTask.mutate(payload, {
          onSuccess: () => {
            onSuccess();
          },
        });
      }
    } else {
      createTask.mutate(payload, {
        onSuccess: () => {
          resetForm();
          onSuccess();
        },
      });
    }
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && <ErrorMessage id="title-error" message={errors.title} />}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description (optional)</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? 'description-error' : undefined}
        />
        {errors.description && <ErrorMessage id="description-error" message={errors.description} />}
      </div>

      <div className="form-group">
        <label htmlFor="dueDate">Due Date (optional)</label>
        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          aria-invalid={!!errors.dueDate}
          aria-describedby={errors.dueDate ? 'dueDate-error' : undefined}
        />
        {errors.dueDate && <ErrorMessage id="dueDate-error" message={errors.dueDate} />}
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
        <button type="submit" disabled={isPending}>
          {buttonText}
        </button>
        <button type="button" className="cancel-button" onClick={onSuccess}>
          Cancel
        </button>
      </div>
    </form>
  );
};
