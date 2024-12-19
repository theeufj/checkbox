import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import TaskForm from './TaskForm';
import { Task } from '../types/types';
import React from 'react';

interface TaskEditDialogProps {
  task: Task;
  onSave: (task: Task) => void;
  onClose: () => void;
}

const TaskEditDialog = ({ task, onSave, onClose }: TaskEditDialogProps) => {
  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        <TaskForm
          onSubmit={onSave}
          initialValues={task}
          isEditing
        />
      </DialogContent>
    </Dialog>
  );
};

export default TaskEditDialog; 