const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const schedule = require('node-schedule');

const app = express();
const port = process.env.port || 3000;

const userRoutes = require('./api/routes/Users');
const fileRoutes = require('./api/routes/Files');
const dataOwnerRoutes = require('./api/routes/DataOwners');
const clearDirectory = require('./api/middlewares/utilities/clearDirectory');
const fetchAPI = require('./kaleido/fetchAPI');

// Middlewares
const job = schedule.scheduleJob('*/5 * * * *', () => {
    clearDirectory('./uploads');
});
app.use(morgan('combined'));
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
app.use('/dataowners', dataOwnerRoutes);

// Error Handlers
app.use((req, res, next) => {
    const error = new Error(`Endpoint doesn't exist.`);
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