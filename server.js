require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend funcionando 🚀");
});
// ===== API ROUTES =====

// GET all tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tasks ORDER BY id DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: `Failed to fetch tasks: ${error.message}` });
    }
});

// POST create a new task
app.post('/api/tasks', async (req, res) => {
    try {
        const { title, priority } = req.body;
        
        if (!title || !priority) {
            return res.status(400).json({ error: 'Title and priority are required' });
        }

        const [result] = await db.query(
            'INSERT INTO tasks (title, priority, isCompleted) VALUES (?, ?, ?)',
            [title, priority, false]
        );

        const [newTask] = await db.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
        res.status(201).json(newTask[0]);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: `Failed to create task: ${error.message}` });
    }
});

// PUT update task (toggle completion)
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { isCompleted } = req.body;

        await db.query(
            'UPDATE tasks SET isCompleted = ? WHERE id = ?',
            [isCompleted, id]
        );

        const [updatedTask] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
        res.json(updatedTask[0]);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: `Failed to update task: ${error.message}` });
    }
});

// DELETE a task
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM tasks WHERE id = ?', [id]);
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: `Failed to delete task: ${error.message}` });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
});
