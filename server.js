const express = require('express');
const app = express();

const morgan = require('morgan');
const dotenv = require('dotenv');
const ApiError = require('./utils/apiError');
const globalErrorHandler = require('./middlewares/errorMiddleware');
dotenv.config({
    path: './config.env'
});

const dbConnection = require("./config/database");
const categoryRoute = require('./routes/categoryRoute');
const subcategoryRoute = require('./routes/subCategoryRoute');

app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}


app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/subcategories', subcategoryRoute);

app.all("*"), (req, res, next) => {
    // const err = new Error(`Can't find this route: ${req.originalUrl}`);
    // res.status(404)
    // next(err.message);
    next(new ApiError(`Can't find this route: ${req.originalUrl}`, 404))
}

app.use(globalErrorHandler);

// DB Connection
dbConnection(globalErrorHandler);

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

// *Events* Handle Erros Outside Express Like DB Connection Errors Or Unhandled Rejections
process.on("unhandledRejection", (err) => {
    console.error(`Unhandled Rejection: ${err.name} - ${err.message}`);
    console.error(err);
    server.close(() => {
        process.exit(1);
        console.error(`Application closed due to unhandled rejection: ${err.name} - ${err.message}`);
    }); 
})


