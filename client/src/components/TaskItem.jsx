import { useEffect, useRef, useState } from 'react';

function TaskItem({ task, onToggleComplete, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const titleInputRef = useRef(null);
  const viewButtonRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      titleInputRef.current?.focus();
    }
  }, [isEditing]);

  function startEditing() {
    setTitle(task.title);
    setDescription(task.description || '');
    setIsEditing(true);
  }

  function cancelEditing() {
    setTitle(task.title);
    setDescription(task.description || '');
    setIsEditing(false);
    viewButtonRef.current?.focus();
  }

  function saveEditing() {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }
    setIsEditing(false);
    if (trimmedTitle !== task.title || description !== (task.description || '')) {
      onUpdate(task._id, { title: trimmedTitle, description });
    }
    viewButtonRef.current?.focus();
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      saveEditing();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      cancelEditing();
    }
  }

  if (isEditing) {
    return (
      <li className="task-item task-item--editing">
        <div className="task-item__edit-fields" onKeyDown={handleKeyDown}>
          <label className="visually-hidden" htmlFor={`edit-title-${task._id}`}>
            Edit task title
          </label>
          <input
            id={`edit-title-${task._id}`}
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            aria-label="Edit task title"
            className="task-item__title-input"
          />
          <label className="visually-hidden" htmlFor={`edit-description-${task._id}`}>
            Edit task description
          </label>
          <textarea
            id={`edit-description-${task._id}`}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            aria-label="Edit task description"
            className="task-item__description-input"
            rows={2}
          />
          <div className="task-item__edit-actions">
            <button type="button" onClick={saveEditing} className="button button--primary">
              Save
            </button>
            <button type="button" onClick={cancelEditing} className="button">
              Cancel
            </button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className={`task-item${task.completed ? ' task-item--completed' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggleComplete(task._id, !task.completed)}
        aria-label={`Mark "${task.title}" as complete`}
        className="task-item__checkbox"
      />
      <button
        type="button"
        ref={viewButtonRef}
        className="task-item__content"
        onClick={startEditing}
        aria-label={`Edit task "${task.title}"`}
      >
        <span className="task-item__title">{task.title}</span>
        {task.description ? (
          <span className="task-item__description">{task.description}</span>
        ) : null}
      </button>
      <button
        type="button"
        onClick={() => onDelete(task._id)}
        className="button button--danger"
        aria-label={`Delete task "${task.title}"`}
      >
        Delete
      </button>
    </li>
  );
}

export default TaskItem;
