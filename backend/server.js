const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'ual_note';
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

// DB connection
const db = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT
});

db.connect(err => {
    if (err) {
        console.error(`MySQL connection failed (${DB_HOST}:${DB_PORT}/${DB_NAME} as ${DB_USER}):`, err.message);
        console.error('Check DB_* environment variables.');
        process.exit(1);
    }
    console.log('MySQL connected.');
});

// CREATE
app.post('/notes', (req, res) => {
    const { judul, isi } = req.body;
    if (!judul || !isi) {
        return res.status(400).json({ error: 'judul and isi are required' });
    }
    const sql = 'INSERT INTO notes (judul, isi) VALUES (?, ?)';
    db.query(sql, [judul, isi], (err, result) => {
        if (err) {
            console.error('Insert note failed:', err.message);
            return res.status(500).json({ error: 'Failed to add note' });
        }
        res.status(201).json({ message: 'Note added', id: result.insertId });
    });
});

// READ
app.get('/notes', (req, res) => {
    db.query('SELECT * FROM notes', (err, results) => {
        if (err) {
            console.error('Fetch notes failed:', err.message);
            return res.status(500).json({ error: 'Failed to fetch notes' });
        }
        res.json(results);
    });
});

// UPDATE
app.put('/notes/:id', (req, res) => {
    const { judul, isi } = req.body;
    if (!judul || !isi) {
        return res.status(400).json({ error: 'judul and isi are required' });
    }
    const sql = 'UPDATE notes SET judul=?, isi=? WHERE id=?';
    db.query(sql, [judul, isi, req.params.id], (err, result) => {
        if (err) {
            console.error('Update note failed:', err.message);
            return res.status(500).json({ error: 'Failed to update note' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json({ message: 'Note updated' });
    });
});

// DELETE
app.delete('/notes/:id', (req, res) => {
    const sql = 'DELETE FROM notes WHERE id=?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error('Delete note failed:', err.message);
            return res.status(500).json({ error: 'Failed to delete note' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json({ message: 'Note deleted' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});