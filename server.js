const express = require('express');
const app = express();

const port = process.env.PORT || 8000;
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config({
    path: './config.env'
});

const dbConnection = require("./config/database");
const categoryRoute = require('./routes/categoryRoute');

app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

app.use('/api/v1/categories', categoryRoute);

// DB Connection
dbConnection();

// Start Server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});