export const validateTaskForm = ({
  title,
  description,
  dueDate,
}: {
  title: string;
  description: string;
  dueDate: string;
}) => {
  const errors: { [key: string]: string } = {};

  if (!title.trim()) {
    errors.title = 'Title is required.';
  }

  if (description.length > 500) {
    errors.description = 'Description cannot exceed 500 characters.';
  }

  if (dueDate && isNaN(new Date(dueDate).getTime())) {
    errors.dueDate = 'Due date must be a valid date.';
  }

  return errors;
};
