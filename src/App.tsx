import React from 'react';
import { useState } from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import { Task } from './types/types';

const theme = createTheme();

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleAddTask = (newTask: Task) => {
    setTasks([...tasks, { ...newTask, createDate: new Date(), id: Date.now() }]);
  };

  const handleEditTask = (editedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === editedTask.id ? editedTask : task
    ));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <TaskForm onSubmit={handleAddTask} />
        <TaskList 
          tasks={tasks} 
          onEditTask={handleEditTask}
        />
      </Container>
    </ThemeProvider>
  );
}

export default App;
