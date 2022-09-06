import express from 'express';
import 'dotenv/config';
import morgan from 'morgan';
import path from 'path';

const app = express();

// const PORT = 3005;
const createPath = () => path.resolve('build/index.html');

app.listen(process.env.PORT, (error) => {
    error ? console.log(error) : console.log(`Server listening on port ${process.env.PORT}`);
});

app.use(express.static('build'));

app.get('/', (req, res) => {
    res.sendFile(createPath());
});

app.use((req, res) => {
   res.sendFile(createPath());
});