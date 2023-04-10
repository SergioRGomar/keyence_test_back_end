import express from 'express';
import cors from 'cors';
import keyence_test_api_route from './routes/keyence_test_api';

const server:any = express();

server.use(express.static('../dist'));
server.use(cors());
server.use(express.json());

//Routes of api
server.use('/apis',keyence_test_api_route);

export default server;