import React from 'react';
import './ErrorMessage.css';

interface ErrorMessageProps {
  message: string;
  id?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, id }) => {
  return (
    <span id={id} role="alert" className="error-message">
      {message}
    </span>
  );
};
