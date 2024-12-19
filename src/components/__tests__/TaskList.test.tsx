import { render, screen, fireEvent } from '@testing-library/react';
import TaskList from '../TaskList';

const mockTasks = [
  {
    id: 1,
    name: 'Task 1',
    description: 'Description 1',
    dueDate: new Date('2024-03-20'),
    createDate: new Date('2024-03-15')
  },
  {
    id: 2,
    name: 'Task 2',
    description: 'Description 2',
    dueDate: new Date('2024-03-25'),
    createDate: new Date('2024-03-16')
  }
];

describe('TaskList', () => {
  const mockOnEditTask = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders task list with correct number of tasks', () => {
    render(<TaskList tasks={mockTasks} onEditTask={mockOnEditTask} />);
    
    const taskRows = screen.getAllByRole('row');
    // +1 for header row
    expect(taskRows).toHaveLength(mockTasks.length + 1);
  });

  test('filters tasks based on search query', () => {
    render(<TaskList tasks={mockTasks} onEditTask={mockOnEditTask} />);
    
    const searchInput = screen.getByLabelText(/search tasks/i);
    fireEvent.change(searchInput, { target: { value: 'Task 1' } });
    
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
  });

  test('sorts tasks by due date', () => {
    render(<TaskList tasks={mockTasks} onEditTask={mockOnEditTask} />);
    
    const dueDateSort = screen.getByText(/due date/i);
    fireEvent.click(dueDateSort);
    
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Task 1');
    expect(rows[2]).toHaveTextContent('Task 2');
  });
}); 