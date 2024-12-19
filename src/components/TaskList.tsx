import { useState, useMemo } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  TableSortLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Task, TaskStatus } from '../types/types';
import TaskEditDialog from './TaskEditDialog';
import { format } from 'date-fns';
import React from 'react';  

interface TaskListProps {
  tasks: Task[];
  onEditTask: (editedTask: Task) => void;
}

const TaskList = ({ tasks, onEditTask }: TaskListProps) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'dueDate' | 'createDate'>('dueDate');

  const getTaskStatus = (task: Task): TaskStatus => {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'overdue';
    if (diffDays <= 7) return 'due soon';
    return 'not urgent';
  };

  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter(task => 
        task.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => 
        sortField === 'dueDate' 
          ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          : (new Date(a.createDate || new Date())).getTime() - (new Date(b.createDate || new Date())).getTime()
      );
  }, [tasks, searchQuery, sortField]);

  return (
    <>
      <TextField
        fullWidth
        label="Search tasks"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        margin="normal"
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'dueDate'}
                  direction={sortField === 'dueDate' ? 'asc' : 'asc'}
                  onClick={() => setSortField('dueDate')}
                >
                  Due Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'createDate'}
                  direction={sortField === 'createDate' ? 'asc' : 'asc'}
                  onClick={() => setSortField('createDate')}
                >
                  Create Date
                </TableSortLabel>
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.name}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{format(new Date(task.dueDate), 'MM/dd/yyyy')}</TableCell>
                <TableCell>
                  {task.createDate && format(new Date(task.createDate), 'MM/dd/yyyy')}
                </TableCell>
                <TableCell>{getTaskStatus(task)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => setEditingTask(task)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {editingTask && (
        <TaskEditDialog
          task={editingTask}
          onSave={(editedTask) => {
            onEditTask(editedTask);
            setEditingTask(null);
          }}
          onClose={() => setEditingTask(null)}
        />
      )}
    </>
  );
};

export default TaskList;