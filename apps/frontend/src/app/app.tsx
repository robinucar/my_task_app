import { useState } from 'react';
import { Task } from '@shared-types';

import { useTasks } from '../hooks/useTasks';
import { useSortParams } from '../hooks/tasks/useSortParams';

import { TaskList } from '../components/TaskList/TaskList';
import { CreateTaskForm } from '../components/CreateTaskForm/CreateTaskForm';
import { CreateTaskModal } from '../components/CreateTaskModal/CreateTaskModal';
import { ConfirmDialog } from '../components/ConfirmDialog/ConfirmDialog';

import './App.css';

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const {
    deleteTask: { mutate: deleteTaskMutate },
  } = useTasks();

  const { sortBy, sortOrder, toggleSort } = useSortParams();

  const handleDeleteRequest = (task: Task) => {
    setTaskToDelete(task); // ✅ Ensure full task object is stored
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (typeof taskToDelete === 'object' && taskToDelete?.id) {
      deleteTaskMutate(taskToDelete.id);
    } else {
      console.error('❌ Task to delete is invalid or missing ID:', taskToDelete);
    }

    setConfirmOpen(false);
    setTaskToDelete(null);
  };

  const handleEditRequest = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  return (
    <>
      <div className={`app-container ${modalOpen || confirmOpen ? 'blurred' : ''}`}>
        <h1>My Tasks</h1>

        <button
          onClick={() => setModalOpen(true)}
          className="create-button"
          aria-label="Open Create Task Modal"
        >
          + Create Task
        </button>

        <div className="sort-controls">
          <button onClick={() => toggleSort('dueDate')}>
            Sort by Due Date {sortBy === 'dueDate' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
          </button>
          <button onClick={() => toggleSort('status')}>
            Sort by Status {sortBy === 'status' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
          </button>
        </div>

        <TaskList onEdit={handleEditRequest} onDelete={handleDeleteRequest} />
      </div>

      {modalOpen && (
        <CreateTaskModal onClose={handleModalClose}>
          <CreateTaskForm onSuccess={handleModalClose} initialValues={editingTask ?? undefined} />
        </CreateTaskModal>
      )}

      {confirmOpen && taskToDelete && (
        <ConfirmDialog
          title="Are You Sure?"
          message="This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => {
            setConfirmOpen(false);
            setTaskToDelete(null);
          }}
        />
      )}
    </>
  );
}

export default App;
