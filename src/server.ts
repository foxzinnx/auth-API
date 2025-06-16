import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import router from './routes/router';

dotenv.config();

const server = express()

server.use(cors());

server.use(express.static(path.join(__dirname, '../public')));
server.use(express.urlencoded({extended: true}));

server.use(router);

server.use((req: Request, res: Response) => {
    res.status(404).json({ error: '404 Not found!'})
})

server.listen(process.env.PORT);