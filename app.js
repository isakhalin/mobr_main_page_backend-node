import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import morgan from 'morgan';
import cors from 'cors';
import {createPath} from "./helpers/create-path.js";

// Routes
import {router as applicationsApiRoutes} from './routes/api-applications-routes.js';
import {router as profilesApiRoutes} from './routes/api-profiles-routes.js';
import {router as ticketsApiRoutes} from './routes/api-tickets-routes.js';

const app = express();
app.listen(process.env.PORT, (error) => {
    error ? console.log(error) : console.log(`Server listening on port ${process.env.PORT}`);
});

mongoose
    .connect(process.env.DB_URL)
    .then((data) => console.log('Connecting to MongoDB successful!'))
    .catch((error) => console.log(error));

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(express.static('build'));

const whitelist = [
    'http://localhost:3000',
    'http://172.16.255.31:3000'
]
app.use(cors({
    credentials: true,
    origin: whitelist
}));

app.use(applicationsApiRoutes);
app.use(profilesApiRoutes);
app.use(ticketsApiRoutes);

// Обработка неучтенных маршрутов
app.use((req, res) => {
    res.sendFile(createPath());
});