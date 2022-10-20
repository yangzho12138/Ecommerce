// Custom Error Handling --> Middleware
// for url not defined
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

// request id (e.g 1) is not a formatted one in /api/products/:id --> fall into custom error handing Or return a HTML
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
    next();
}

export { notFound, errorHandler }