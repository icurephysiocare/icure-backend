// src/utils/asyncHandler.js
// Utility to wrap async route handlers to catch errors automatically
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
