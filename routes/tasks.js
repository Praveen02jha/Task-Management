const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

const db = new sqlite3.Database('./database/db.sqlite');

// Ensure user is authenticated
function isAuthenticated(req, res, next) {
    if (!req.session.user) return res.redirect('/auth/login');
    next();
}

// List tasks
router.get('/', isAuthenticated, (req, res) => {
    db.all('SELECT * FROM tasks WHERE user_id = ?', [req.session.user.id], (err, tasks) => {
        if (err) return res.send('Error fetching tasks');
        res.render('index', { tasks });
    });
});

// Create task
router.get('/create', isAuthenticated, (req, res) => {
    res.render('create');
});

router.post('/create', isAuthenticated, (req, res) => {
    const { task_name, description, deadline } = req.body;
    db.run(
        'INSERT INTO tasks (user_id, task_name, description, deadline, status) VALUES (?, ?, ?, ?, "Pending")',
        [req.session.user.id, task_name, description, deadline],
        (err) => {
            if (err) return res.send('Error creating task');
            res.redirect('/tasks');
        }
    );
});

// Delete task
router.post('/delete/:id', isAuthenticated, (req, res) => {
    db.run('DELETE FROM tasks WHERE id = ? AND user_id = ?', [req.params.id, req.session.user.id], (err) => {
        if (err) return res.send('Error deleting task');
        res.redirect('/tasks');
    });
});

module.exports = router;
