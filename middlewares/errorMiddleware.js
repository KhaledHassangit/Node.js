const ApiError = require('../utils/apiError');

const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Handle JWT Errors
    if (err.name === 'JsonWebTokenError') {
        err = handleJwtInvalidSignature();
    } else if (err.name === 'TokenExpiredError') {
        err = handleJwtExpired();
    }

    if (process.env.NODE_ENV === 'development') {
        sendErrorForDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        sendErrorForProd(err, res);
    }
};

//  DEV 
const sendErrorForDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

//  PROD 
const sendErrorForProd = (err, res) => {
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }

    console.error('ERROR 💥', err);

    return res.status(500).json({
        status: 'error',
        message: 'Something went wrong'
    });
};

//  JWT HANDLERS 
const handleJwtInvalidSignature = () => {
    return new ApiError('Invalid token. Please log in again!', 401);
};

const handleJwtExpired = () => {
    return new ApiError('Your token has expired. Please log in again!', 401);
};

module.exports = globalErrorHandler;