const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const port = process.env.port || 3000;

const userRoutes = require('./api/routes/Users');
const fileRoutes = require('./api/routes/Files');

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'will start coding tomorrow'
    });
});

app.use('/users', userRoutes);
app.use('/files', fileRoutes);

// Error Handlers
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

// Listening at 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});