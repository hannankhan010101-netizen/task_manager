import { useEffect, useState } from 'react';
import { createTask, deleteTask, getTasks, updateTask } from './api.js';
import TaskItem from './components/TaskItem.jsx';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadTasks() {
      try {
        const data = await getTasks();
        if (isMounted) {
          setTasks(data);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadTasks();
    return () => {
      isMounted = false;
    };
  }, []);

  async function handleAddTask(event) {
    event.preventDefault();
    const trimmedTitle = newTitle.trim();
    if (!trimmedTitle) {
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const created = await createTask({
        title: trimmedTitle,
        description: newDescription.trim(),
      });
      setTasks((current) => [...current, created]);
      setNewTitle('');
      setNewDescription('');
    } catch (createError) {
      setError(createError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleToggleComplete(id, completed) {
    try {
      const updated = await updateTask(id, { completed });
      setTasks((current) => current.map((task) => (task._id === id ? updated : task)));
    } catch (updateError) {
      setError(updateError.message);
    }
  }

  async function handleUpdateTask(id, updates) {
    try {
      const updated = await updateTask(id, updates);
      setTasks((current) => current.map((task) => (task._id === id ? updated : task)));
    } catch (updateError) {
      setError(updateError.message);
    }
  }

  async function handleDeleteTask(id) {
    try {
      await deleteTask(id);
      setTasks((current) => current.filter((task) => task._id !== id));
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  const remainingCount = tasks.filter((task) => !task.completed).length;

  return (
    <div className="app">
      <header className="app__header">
        <h1>Task Manager</h1>
      </header>

      <main className="task-manager">
        <h2>Tasks</h2>

        <form onSubmit={handleAddTask} className="task-form">
          <label className="visually-hidden" htmlFor="new-task-title">
            Task title
          </label>
          <input
            id="new-task-title"
            type="text"
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            placeholder="What needs to be done?"
            aria-label="Task title"
            className="task-form__title-input"
            required
          />
          <label className="visually-hidden" htmlFor="new-task-description">
            Task description
          </label>
          <input
            id="new-task-description"
            type="text"
            value={newDescription}
            onChange={(event) => setNewDescription(event.target.value)}
            placeholder="Description (optional)"
            aria-label="Task description"
            className="task-form__description-input"
          />
          <button type="submit" className="button button--primary" disabled={isSubmitting}>
            Add task
          </button>
        </form>

        {error && (
          <p className="app__error" role="alert">
            {error}
          </p>
        )}

        {isLoading ? (
          <p className="app__status">Loading tasks…</p>
        ) : tasks.length === 0 ? (
          <p className="app__status">No tasks yet. Add one above to get started.</p>
        ) : (
          <>
            <p className="task-manager__counter">
              {remainingCount} of {tasks.length} remaining
            </p>
            <ul className="task-list">
              {tasks.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
