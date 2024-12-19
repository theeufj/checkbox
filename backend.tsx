// todo add a database for persistence.

// Basic Express server setup with TypeScript
import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';

const app = express();
const pool = new Pool(); // Single pool instance

app.use(cors());
app.use(express.json());

// GET /api/tasks - List all tasks (with pagination)
app.get('/api/tasks', async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;

        // Get total count for pagination
        const countResult = await pool.query('SELECT COUNT(*) FROM tasks');
        const total = parseInt(countResult.rows[0].count);

        // Get paginated tasks
        const result = await pool.query(
            'SELECT * FROM tasks ORDER BY created_at DESC LIMIT $1 OFFSET $2',
            [limit, offset]
        );

        res.json({
            tasks: result.rows,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/tasks - Create new task
app.post('/api/tasks', async (req, res) => {
    try {
        const { name, description, due_date } = req.body;
        await pool.query('INSERT INTO tasks (name, description, due_date) VALUES ($1, $2, $3)', [name, description, due_date]);
        res.status(201).json({ message: 'Task created successfully' });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /api/tasks/:id - Update task
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, due_date } = req.body;
        await pool.query('UPDATE tasks SET name = $1, description = $2, due_date = $3 WHERE id = $4', [name, description, due_date, id]);
        res.json({ message: 'Task updated successfully' });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/tasks/search?query={searchTerm} - Search tasks
app.get('/api/tasks/search', async (req, res) => {
    try {
        const { query } = req.query;
        const result = await pool.query('SELECT * FROM tasks WHERE name ILIKE $1', [`%${query}%`]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error searching tasks:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

export default app;