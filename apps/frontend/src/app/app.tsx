import { useState } from 'react';
import { TaskList } from '../components/TaskList/TaskList';
import { CreateTaskForm } from '../components/CreateTaskForm/CreateTaskForm';
import { CreateTaskModal } from '../components/CreateTaskModal/CreateTaskModal';
import { ConfirmDialog } from '../components/ConfirmDialog/ConfirmDialog';
import { useTasks } from '../hooks/useTasks';
import { useSortParams } from '../hooks/tasks/useSortParams';
import { Task } from '@shared-types';
import './App.css';

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const { deleteTask } = useTasks();
  const { sortBy, sortOrder, toggleSort } = useSortParams();

  const handleDeleteRequest = (taskId: string) => {
    setTaskToDelete({ id: taskId } as Task);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      deleteTask.mutate(taskToDelete.id);
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
