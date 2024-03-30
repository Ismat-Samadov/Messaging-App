// backend/middleware/errorMiddleware.js
exports.handleError = (err, req, res) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
};