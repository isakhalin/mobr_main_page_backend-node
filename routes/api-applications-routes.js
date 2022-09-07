import express from 'express';
import {
    getAllApplications,
    postApplication
} from '../controllers/api-applications-controller.js';

export const router = express.Router(); // Создаем экземпляр роутера

// Возвращаем на клиент все апликейшены из контроллера
router.get('/api/get/applications', getAllApplications);

// Передаем апликейшен в контроллер для его записи в БД
router.post('/api/post/application', postApplication)