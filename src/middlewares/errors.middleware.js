export default function errorsMiddleware(err, req, res, next) {
    const status = err.status || err.statusCode || 500

    const statusTexts = {
        400: 'Bad request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not found',
        409: 'Conflict',
        418: 'I\'m a teapot',
        500: 'Internal server error'
    }

    res.status(status).json({
        timestamp: new Date().toISOString(),
        code: status,
        error: statusTexts[status] || 'Internal server error',
        message: err.message,
        path: req.originalUrl
    })
}