import mongoose from "mongoose";
import config from "./config/config.js";
import app from './app.js'

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