const express = require('express');

// Example middleware function
const exampleMiddleware = (req, res, next) => {
    console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
    next();
};

module.exports = exampleMiddleware;
