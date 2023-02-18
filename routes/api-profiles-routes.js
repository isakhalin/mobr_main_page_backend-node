import express from 'express';

// Контроллеры
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