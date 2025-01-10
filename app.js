const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(
    session({
        store: new SQLiteStore(),
        secret: 'secret_key',
        resave: false,
        saveUninitialized: false,
    })
);

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// Default route
app.get('/', (req, res) => {
    if (!req.session.user) return res.redirect('/auth/login');
    res.redirect('/tasks');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
