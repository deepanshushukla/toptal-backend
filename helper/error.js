const ErrorResponse = require("../helper/errorResponse");
const MESSAGES = require('../constants/messages');
const STATUS_CODES = require('../constants/statusCodes');
const errorHandler = (err, req, res, next) => {
    // Log to console for dev
    let error = { ...err };

    error.message = err.message;

    // console.log(err.stack);

    // Mongoose bad ObjectId
    if (err.name === "CastError") {
        const message = `Resource not found`;
        error = new ErrorResponse(message, STATUS_CODES.NOT_FOUND);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = `Duplicate field value entered`;
        error = new ErrorResponse(message, STATUS_CODES.NOT_FOUND);
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map(value => value.message);
        error = new ErrorResponse(message, STATUS_CODES.BAD_REQUEST);
    }

    res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: error.message || MESSAGES.INTERNAL_SERVER_ERROR
    });
};

module.exports = errorHandler;