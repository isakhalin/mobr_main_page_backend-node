import express from 'express';
import {
    getAllApplications,
    postApplication,
    deleteApplication,
} from '../controllers/api-applications-controller.js';

export const router = express.Router(); // Создаем экземпляр роутера

// Возвращаем на клиент все апликейшены из контроллера
router.get('/api/allapplications', getAllApplications);

// Передаем апликейшен в контроллер для его записи в БД
router.post('/api/application', postApplication);

// Передаем апликейшен в контроллер для уго удаления из БД
router.delete('/api/application/:id', deleteApplication);


router.get('/api/test', (req, res) => {
    res.status(200).json({msg: 'This is CORS-enabled for a whitelisted domain.'});
    res.end();
});