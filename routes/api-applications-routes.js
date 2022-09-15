import express from 'express';

// Подключение контроллеров
import {
    getAllApplications,
    postApplication,
    updateApplication,
    deleteApplication,
} from '../controllers/api-applications-controller.js';

export const router = express.Router(); // Создаем экземпляр роутера

// Возвращаем на клиент все апликейшены из контроллера
router.get('/api/allapplications', getAllApplications);

// Передаем апликейшен в контроллер для его записи в БД
router.post('/api/application', postApplication);

// Изменяем в апликейшене флаг isComplete в БД
router.patch('/api/application/:id', updateApplication);

// Передаем апликейшен в контроллер для уго удаления из БД
router.delete('/api/application/:id', deleteApplication);