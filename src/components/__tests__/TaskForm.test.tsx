import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TaskForm from '../TaskForm';
import React from 'react';

const MockTaskForm = (props: any) => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <TaskForm {...props} />
  </LocalizationProvider>
);

describe('TaskForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders create task form with empty fields', () => {
    render(<MockTaskForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText(/name/i)).toHaveValue('');
    expect(screen.getByLabelText(/description/i)).toHaveValue('');
    expect(screen.getByText(/create new task/i)).toBeInTheDocument();
  });

  test('submits form with correct data', () => {
    render(<MockTaskForm onSubmit={mockOnSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test Task' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Test Description' } });
    
    fireEvent.click(screen.getByText(/create task/i));
    
    expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Test Task',
      description: 'Test Description',
      dueDate: expect.any(Date)
    }));
  });
}); 