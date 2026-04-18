/// ================= IMPORTS =================
const express = require('express');
const path = require('path');

const cors = require('cors')
const compression = require('compression')
const hpp = require('hpp');
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');

const morgan = require('morgan');
const dotenv = require('dotenv');

const dbConnection = require('./config/database');

const ApiError = require('./utils/apiError');
const globalErrorHandler = require('./middlewares/errorMiddleware');

const mountRoutes = require('./routes/index');
const { webhookCheckout } = require('./controllers/orderService');
const { rateLimit } = require('express-rate-limit');


/// ================= CONFIG =================
dotenv.config({ path: './config.env' });


/// ================= APP INIT =================
const app = express();
app.use(cors());
app.options('*', cors());
app.use(compression());
/// ================= MIDDLEWARES =================
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(mongoSanitize());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    message: 'Too many requests from this IP, please try again after 15 minutes',
})

// Apply the rate limiting middleware to all requests.
app.use('/api', limiter);

app.use(express.urlencoded({ extended: true, limit: '20kb' }));
// Express middleware to protect against HTTP Parameter Pollution attacks
app.use(hpp({
    whitelist: ['price', 'ratingsAverage',
        'ratingsQuantity', 'quantity', 'sold']
}));

/// ================= LOGGING =================

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
