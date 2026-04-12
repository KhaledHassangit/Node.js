/// ================= IMPORTS =================
const express = require('express');
const path = require('path');

const morgan = require('morgan');
const dotenv = require('dotenv');

const dbConnection = require('./config/database');

const ApiError = require('./utils/apiError');
const globalErrorHandler = require('./middlewares/errorMiddleware');

const categoryRoute = require('./routes/categoryRoute');
const subcategoryRoute = require('./routes/subCategoryRoute');
const brandRoute = require('./routes/brandRoute');
const productRoute = require('./routes/productRoute');
const userRoute = require('./routes/userRoute');


/// ================= CONFIG =================
dotenv.config({ path: './config.env' });


/// ================= APP INIT =================
const app = express();


/// ================= MIDDLEWARES =================
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}


/// ================= ROUTES =================
app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/subcategories', subcategoryRoute);
app.use('/api/v1/brands', brandRoute);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/users', userRoute);


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