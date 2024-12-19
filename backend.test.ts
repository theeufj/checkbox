import request from 'supertest';

// Create a mock pool before importing the app
const mockPool = {
  query: jest.fn()
};

jest.mock('pg', () => ({
  Pool: jest.fn(() => mockPool)
}));

// Import your app after the mock is set up
import app from './backend';

describe('Task API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/tasks', () => {
    it('should return paginated tasks', async () => {
      const mockTasks = [
        { id: 1, name: 'Task 1', description: 'Desc 1', due_date: '2024-03-20' },
        { id: 2, name: 'Task 2', description: 'Desc 2', due_date: '2024-03-21' },
      ];

      (mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [{ count: '10' }] })
        .mockResolvedValueOnce({ rows: mockTasks });

      const response = await request(app)
        .get('/api/tasks')
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        tasks: mockTasks,
        pagination: {
          total: 10,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const newTask = {
        name: 'New Task',
        description: 'New Description',
        due_date: '2024-03-22',
      };

      (mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .post('/api/tasks')
        .send(newTask);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: 'Task created successfully' });
      expect(mockPool.query).toHaveBeenCalledWith(
        'INSERT INTO tasks (name, description, due_date) VALUES ($1, $2, $3)',
        [newTask.name, newTask.description, newTask.due_date]
      );
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update an existing task', async () => {
      const updatedTask = {
        name: 'Updated Task',
        description: 'Updated Description',
        due_date: '2024-03-23',
      };

      (mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .put('/api/tasks/1')
        .send(updatedTask);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Task updated successfully' });
      expect(mockPool.query).toHaveBeenCalledWith(
        'UPDATE tasks SET name = $1, description = $2, due_date = $3 WHERE id = $4',
        [updatedTask.name, updatedTask.description, updatedTask.due_date, '1']
      );
    });
  });

  describe('GET /api/tasks/search', () => {
    it('should search tasks by name', async () => {
      const mockSearchResults = [
        { id: 1, name: 'Task 1', description: 'Desc 1', due_date: '2024-03-20' },
      ];

      (mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: mockSearchResults });

      const response = await request(app)
        .get('/api/tasks/search')
        .query({ query: 'Task 1' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSearchResults);
      expect(mockPool.query).toHaveBeenCalledWith(
        'SELECT * FROM tasks WHERE name ILIKE $1',
        ['%Task 1%']
      );
    });
  });
}); 