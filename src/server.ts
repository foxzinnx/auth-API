import express, { Request, Response, ErrorRequestHandler } from 'express';
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
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if(err.status){
        res.status(err.status);
    } else {
        res.status(400);
    }

    if(err.message){
        res.json({ error: err.message });
    } else {
        res.json({ error: 'Ocorreu um erro.'});
    }
}

server.use(errorHandler);

server.listen(process.env.PORT);