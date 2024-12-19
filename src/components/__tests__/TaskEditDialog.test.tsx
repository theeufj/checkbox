import { render, screen, fireEvent } from '@testing-library/react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TaskEditDialog from '../TaskEditDialog';
import React from 'react';

const MockTaskEditDialog = (props: any) => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <TaskEditDialog {...props} />
  </LocalizationProvider>
);

describe('TaskEditDialog', () => {
  const mockTask = {
    id: 1,
    name: 'Test Task',
    description: 'Test Description',
    dueDate: new Date(),
    createDate: new Date()
  };
  
  const mockOnSave = jest.fn();
  const mockOnClose = jest.fn();

  test('renders with task data', () => {
    render(
      <MockTaskEditDialog 
        task={mockTask}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );
    
    expect(screen.getByLabelText(/name/i)).toHaveValue(mockTask.name);
    expect(screen.getByLabelText(/description/i)).toHaveValue(mockTask.description);
  });

  test('calls onSave with updated task data', () => {
    render(
      <MockTaskEditDialog 
        task={mockTask}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );
    
    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'Updated Task' } });
    
    fireEvent.click(screen.getByText(/save changes/i));
    
    expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
      ...mockTask,
      name: 'Updated Task'
    }));
  });
}); 