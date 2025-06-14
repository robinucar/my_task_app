import { useState } from 'react';
import { Task, TaskStatus } from '@shared-types';
import { validateTaskForm } from '../utils/validateTaskForm';
import { TaskPayloadCreate, TaskPayloadUpdate } from '@shared-types';

/**
 * Hook to manage state and validation for the task form.
 *
 * @param initialValues - Optional initial task data for editing.
 * @returns Task form state, setters, errors, reset and payload builder.
 */
export const useTaskFormState = (initialValues?: Partial<Task> & { id?: string }) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [dueDate, setDueDate] = useState(
    initialValues?.dueDate ? new Date(initialValues.dueDate).toISOString().split('T')[0] : '',
  );
  const [status, setStatus] = useState<TaskStatus>(initialValues?.status || TaskStatus.PENDING);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isEditing = !!initialValues?.id;

  /**
   * Validates fields and builds a task payload for create or update.
   *
   * @returns Task payload or null if invalid.
   */
  const validateAndBuildPayload = (): TaskPayloadCreate | TaskPayloadUpdate | null => {
    const validationErrors = validateTaskForm({ title, description, dueDate });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return null;

    const basePayload: TaskPayloadCreate = {
      title: title.trim(),
      description: description.trim() === '' ? null : description.trim(),
      dueDate: dueDate.trim() ? new Date(dueDate) : undefined,
      status,
    };

    if (isEditing && initialValues?.id) {
      return {
        ...basePayload,
        id: initialValues.id,
      };
    }

    return basePayload;
  };

  /**
   * Resets the form to default state.
   */
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setStatus(TaskStatus.PENDING);
    setErrors({});
  };

  return {
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
    isEditing,
  };
};
