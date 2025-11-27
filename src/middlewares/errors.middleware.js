const errorsMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    let statusText
    switch (statusCode) {
        case 400:
            statusText = 'Bad request'
            break;
        case 404:
            statusText = 'Not found'
            break;
        default:
            statusText = 'Internal server error'
    }
    return res.status(statusCode).json({
        timestamp: new Date().toISOString(),
        code: statusCode,
        error: statusText,
        message: err.message,
        path: req.path
    })
}
export default errorsMiddleware