import express from 'express';

// Контроллеры
import {
    getAllApplications,
    postApplication,
    updateApplication,
    deleteApplication,
} from '../controllers/api-applications-controller.js';

export const router = express.Router();

router.get('/api/allapplications', getAllApplications);
router.post('/api/application', postApplication);
router.patch('/api/application/:id', updateApplication);
router.delete('/api/application/:id', deleteApplication);