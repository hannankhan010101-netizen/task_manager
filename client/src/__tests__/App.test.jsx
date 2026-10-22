import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App.jsx';
import * as api from '../api.js';

vi.mock('../api.js');

describe('App', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('shows an empty state when there are no tasks', async () => {
    api.getTasks.mockResolvedValue([]);

    render(<App />);

    expect(await screen.findByText(/no tasks yet/i)).toBeInTheDocument();
  });

  it('shows an error message when fetching tasks fails', async () => {
    api.getTasks.mockRejectedValue(new Error('Server is unreachable'));

    render(<App />);

    expect(await screen.findByText('Server is unreachable')).toBeInTheDocument();
  });

  it('adds a task through the form', async () => {
    const user = userEvent.setup();
    api.getTasks.mockResolvedValue([]);
    api.createTask.mockResolvedValue({
      _id: '1',
      title: 'Buy milk',
      description: '',
      completed: false,
    });

    render(<App />);
    await screen.findByText(/no tasks yet/i);

    await user.type(screen.getByLabelText('Task title'), 'Buy milk');
    await user.click(screen.getByRole('button', { name: /add task/i }));

    expect(await screen.findByText('Buy milk')).toBeInTheDocument();
    expect(screen.getByText('1 of 1 remaining')).toBeInTheDocument();
    expect(api.createTask).toHaveBeenCalledWith({ title: 'Buy milk', description: '' });
  });

  it('renders a strikethrough style when a task is toggled complete', async () => {
    const user = userEvent.setup();
    const task = { _id: '1', title: 'Buy milk', description: '', completed: false };
    api.getTasks.mockResolvedValue([task]);
    api.updateTask.mockResolvedValue({ ...task, completed: true });

    render(<App />);

    const checkbox = await screen.findByLabelText('Mark "Buy milk" as complete');
    await user.click(checkbox);

    await waitFor(() => {
      expect(screen.getByText('Buy milk')).toHaveClass('task-item__title');
    });
    expect(screen.getByText('Buy milk').closest('li')).toHaveClass('task-item--completed');
    expect(api.updateTask).toHaveBeenCalledWith('1', { completed: true });
  });
});
