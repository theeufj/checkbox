import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Paper,
  Typography 
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Task } from '../types/types';

interface TaskFormProps {
  onSubmit: (task: Task) => void;
  initialValues?: Task;
  isEditing?: boolean;
}

const TaskForm = ({ onSubmit, initialValues, isEditing = false }: TaskFormProps) => {
  const [task, setTask] = useState<Task>(initialValues || {
    name: '',
    description: '',
    dueDate: new Date(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(task);
    if (!isEditing) {
      setTask({ name: '', description: '', dueDate: new Date() });
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        {isEditing ? 'Edit Task' : 'Create New Task'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          value={task.name}
          onChange={(e) => setTask({ ...task, name: e.target.value })}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Description"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          required
          margin="normal"
          multiline
          rows={3}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Due Date"
            value={task.dueDate}
            onChange={(date) => setTask({ ...task, dueDate: date || new Date() })}
          />
        </LocalizationProvider>
        <Button 
          type="submit" 
          variant="contained" 
          sx={{ mt: 2 }}
        >
          {isEditing ? 'Save Changes' : 'Create Task'}
        </Button>
      </Box>
    </Paper>
  );
};

export default TaskForm; 