import dotenv from 'dotenv'

dotenv.config()

const config = {
    port: process.env.PORT || 3000,
    mongodb: {
        uri: process.env.MONGO_URI || 'mongodb://alex:20011995/localhost:27017/forum',
        db: {
            dbName: process.env.DB_NAME || 'java61'
        }
    }
}

export default config