
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression'
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';
import router from './router';

// environment variables
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;

// initialize express app
const app = express();

app.use(cors({
    credentials: true,
    origin: 'http://192.168.2.31:8081',
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
    console.log('Server listening on port 8080');    
});

mongoose.Promise = Promise;
mongoose.connect(MONGO_URI)
mongoose.connection.on("error", (error: Error) => console.log(error));

app.use("/", router());
  