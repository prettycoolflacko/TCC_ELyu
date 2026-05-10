const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// DB connection (LOCAL first)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // adjust
    database: 'ual_note'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// CREATE
app.post('/notes', (req, res) => {
    const { judul, isi } = req.body;
    const sql = 'INSERT INTO notes (judul, isi) VALUES (?, ?)';
    db.query(sql, [judul, isi], (err, result) => {
        if (err) throw err;
        res.send('Note added');
    });
});

// READ
app.get('/notes', (req, res) => {
    db.query('SELECT * FROM notes', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// UPDATE
app.put('/notes/:id', (req, res) => {
    const { judul, isi } = req.body;
    const sql = 'UPDATE notes SET judul=?, isi=? WHERE id=?';
    db.query(sql, [judul, isi, req.params.id], (err, result) => {
        if (err) throw err;
        res.send('Note updated');
    });
});

// DELETE
app.delete('/notes/:id', (req, res) => {
    const sql = 'DELETE FROM notes WHERE id=?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.send('Note deleted');
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});