const sqlite3 = require('sqlite3').verbose();

// Connect to the database (or create it if it doesn't exist)
const db = new sqlite3.Database('./database/db.sqlite');

// Create tables
db.serialize(() => {
    console.log('Initializing the database...');

    // Create the `users` table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error('Error creating users table:', err.message);
        } else {
            console.log('Users table created successfully.');
        }
    });

    // Create the `tasks` table
    db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            task_name TEXT NOT NULL,
            description TEXT,
            deadline TEXT,
            status TEXT DEFAULT 'Pending',
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `, (err) => {
        if (err) {
            console.error('Error creating tasks table:', err.message);
        } else {
            console.log('Tasks table created successfully.');
        }
    });
});

// Close the database connection
db.close(() => {
    console.log('Database initialization complete.');
});
