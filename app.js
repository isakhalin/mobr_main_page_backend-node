import express from 'express';
import 'dotenv/config';
import morgan from 'morgan';    // Подключаем библиотеку логгера
import path from 'path';
import {createPath} from "./helpers/create-path.js";

const app = express();

app.listen(process.env.PORT, (error) => {
    error ? console.log(error) : console.log(`Server listening on port ${process.env.PORT}`);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(express.static('build'));

// app.get('/', (req, res) => {
//     res.sendFile(createPath());
// });

app.use((req, res) => {
    res.sendFile(createPath());
});