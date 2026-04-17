/// ================= IMPORTS =================
const express = require('express');
const path = require('path');
const cors = require('cors')
const compression = require('compression')

const morgan = require('morgan');
const dotenv = require('dotenv');

const dbConnection = require('./config/database');

const ApiError = require('./utils/apiError');
const globalErrorHandler = require('./middlewares/errorMiddleware');

const mountRoutes = require('./routes/index');
const { webhookCheckout } = require('./controllers/orderService');


/// ================= CONFIG =================
dotenv.config({ path: './config.env' });


/// ================= APP INIT =================
const app = express();
app.use(cors());
app.options('*', cors());
app.use(compression());
/// ================= MIDDLEWARES =================
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}


/// ================= ROUTES =================
mountRoutes(app);

/// ================= NOT FOUND =================
app.use((req, res, next) => {
    next(new ApiError(`Can't find this route: ${req.originalUrl}`, 404));
});

/// ================= ERROR HANDLER =================
app.use(globalErrorHandler);


/// ================= DB CONNECTION =================
dbConnection();


/// ================= SERVER =================
const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


/// ================= GLOBAL ERRORS =================
process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection: ${err.name} - ${err.message}`);

    server.close(() => {
        process.exit(1);
    });
});


// Checkout webhook
app.post(
    '/webhook-checkout',
    express.raw({ type: 'application/json' }),
    webhookCheckout
);
