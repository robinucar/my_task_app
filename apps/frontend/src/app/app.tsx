import { useState } from 'react';
import { TaskList } from '../components/TaskList';
import { CreateTaskForm } from '../components/CreateTaskForm/CreateTaskForm';
import { CreateTaskModal } from '../components/CreateTaskModal/CreateTaskModal';
import { useTasks } from '../hooks/useTasks';
import { ConfirmDialog } from '../components/ConfirmDialog/ConfirmDialog';
import { Task } from '@shared-types';
import './App.css';

type SortBy = 'status' | 'dueDate' | 'createdAt' | null;
type SortOrder = 'asc' | 'desc';

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const [sortBy, setSortBy] = useState<SortBy>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const { deleteTask } = useTasks();

  const handleSortToggle = (field: Exclude<SortBy, null>) => {
    if (sortBy !== field) {
      setSortBy(field);
      setSortOrder('asc');
    } else if (sortOrder === 'asc') {
      setSortOrder('desc');
    } else {
      setSortBy('createdAt');
      setSortOrder('desc');
    }
  };

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
        <button onClick={() => handleSortToggle('dueDate')}>
          Sort by Due Date {sortBy === 'dueDate' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
        </button>
        <button onClick={() => handleSortToggle('status')}>
          Sort by Status {sortBy === 'status' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
        </button>
      </div>

      <TaskList
        onEdit={handleEditRequest}
        onDelete={handleDeleteRequest}
        sortBy={sortBy}
        sortOrder={sortOrder}
        toggleSort={handleSortToggle}
      />

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
    </div>
  );
}

export default App;
