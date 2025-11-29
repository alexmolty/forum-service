import express from 'express'
import postRoutes from './routes/post.routes.js'
import errorsMiddleware from './middlewares/errors.middleware.js'

// Build and export an express app without side effects (no DB connection, no listen)
const app = express()

app.use(express.json())

app.use('/forum', postRoutes)

// Catch-all for unknown routes
app.use((req, res, next) => {
    const err = new Error(`Route ${req.method} ${req.originalUrl} not found`)
    err.statusCode = 404
    next(err)
})

app.use(errorsMiddleware)

export default app
