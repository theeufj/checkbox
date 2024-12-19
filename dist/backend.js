"use strict";
// todo add a database for persistence.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Basic Express server setup with TypeScript
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const pool = new pg_1.Pool({
    // Add your database configuration here
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
});
// Add database connection verification
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1); // Exit if we can't connect to the database
    }
    release();
    console.log('Successfully connected to database');
});
// Add error handling for the pool
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(1);
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// GET /api/tasks - List all tasks (with pagination)
app.get('/api/tasks', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        // Get total count for pagination
        const countResult = await pool.query('SELECT COUNT(*) FROM tasks');
        const total = parseInt(countResult.rows[0].count);
        // Get paginated tasks
        const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
        res.json({
            tasks: result.rows,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
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
    }
    catch (error) {
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
    }
    catch (error) {
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
    }
    catch (error) {
        console.error('Error searching tasks:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
exports.default = app;
