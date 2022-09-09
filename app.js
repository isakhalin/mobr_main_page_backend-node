import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import morgan from 'morgan';    // Подключаем библиотеку логгера
import cors from 'cors';
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
    .catch((error) => console.log(error));

// Мидлвар для парсинга входящего запроса из формы (данные в виде строк). Используется для получения данных из форм фронта
app.use(express.urlencoded({extended: false}));
// app.use(express.json());    // Мидлвара для обработки json
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(express.static('build'));

// Разрешения для CORS-политики
const whitelist = [
    'http://localhost:3000',
    'http://172.16.255.31:3000'
]
app.use(cors({
    credentials: true,
    origin: whitelist
    //    origin: function (origin, cb) {
    //         console.log('ORIGIN ', origin)
    //         if (whitelist.indexOf(origin) !== -1) {
    //             cb(null, true)
    //         } else {
    //             cb(new Error('Not allowed by CORS'))
    //         }
    //     }
}));

app.use(applicationsApiRoutes);

//// app.get('/', (req, res) => {
//     res.sendFile(createPath());
// });

app.use((req, res) => {
    res.sendFile(createPath());
});