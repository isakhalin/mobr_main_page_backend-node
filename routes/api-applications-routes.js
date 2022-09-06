import express from 'express';
import {controller} from '../controllers/api-applications-controller.js';

export const router = express.Router(); // Создаем экземпляр роутера

// Возвращаем на клиент все апликейшены из контроллера
router.get('/api/applications', controller);