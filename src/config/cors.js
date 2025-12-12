import cors from 'cors';

const corsOptions = {
    origin: 'http://localhost:3000', // фронт
    credentials: true,               // разрешить cookie и Authorization header
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

export default cors(corsOptions);
