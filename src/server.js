import express from 'express'
import mongoose from "mongoose";
import config from "../src/config/config.js";
import postRoutes from "./routes/post.routes.js";
import errorsMiddleware from "./middlewares/errors.middleware.js";

const app = express()
app.use(express.json())

app.use('/forum', postRoutes)
app.use(errorsMiddleware)

const connectDB = async () => {
    try {
        await mongoose.connect(config.mongodb.uri, config.mongodb.db)
    } catch (error) {
        console.log('MongoDB connection error: ', error)
    }
}

const startServer = async () => {
    await connectDB()
    app.listen(config.port, () => console.log(`Server started on port ${config.port}. Press Ctrl-C to finish`));
}

startServer()