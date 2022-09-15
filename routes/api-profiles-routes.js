import express from 'express';

// Подключение контроллеров
import {
    setProfile,
    getProfiles,
    getProfile,
    updateProfile,
    deleteProfile
} from '../controllers/api-profiles-controller.js'

export const router = express.Router();

router.post('/api/profile', setProfile);
router.get('/api/allprofiles/:id', getProfiles);
router.get('/api/profile/:id', getProfile);
router.patch('/api/profile/:id', updateProfile);
router.delete('/api/profile/:id', deleteProfile);