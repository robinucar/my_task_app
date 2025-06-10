import React from 'react';

export const Loading: React.FC = () => {
  return (
    <div className="loading" role="status" aria-live="polite">
      <span className="loading__spinner" aria-hidden="true" />
      <span className="loading__text">Loading...</span>
    </div>
  );
};
