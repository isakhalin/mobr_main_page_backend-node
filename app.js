import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import morgan from 'morgan';    // Подключаем библиотеку логгера
import path from 'path';
import {createPath} from "./helpers/create-path.js";
import {router as applicationsApiRoutes} from './routes/api-applications-routes.js'

const app = express();

app.listen(process.env.PORT, (error) => {
    error ? console.log(error) : console.log(`Server listening on port ${process.env.PORT}`);
});

// Подключение к MongoDB
mongoose
    .connect(process.env.DB_URL)
    .then((data) => console.log('Connecting to MongoDB successful!'))
    .catch((error) => console.log(error))

// Мидлвар для парсинга входящего запроса из формы. Используется для получения данных из форм фронта
app.use(express.urlencoded({extended: false}));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(express.static('build'));

app.use(applicationsApiRoutes);

// app.get('/', (req, res) => {
//     res.sendFile(createPath());
// });

app.use((req, res) => {
    res.sendFile(createPath());
});