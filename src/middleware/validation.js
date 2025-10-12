// src/middleware/validation.js
const { ApiError } = require('./errorHandler');

const validate = (schema) => (req, res, next) => {
    const { value, error } = schema.validate(req.body, { errors: { label: 'key' } });

    if (error) {
        const errorMessage = error.details.map((details) => details.message).join(', ');
        return next(new ApiError(400, errorMessage));
    }
    Object.assign(req, value);
    next();
};

module.exports = validate;