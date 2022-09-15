import express from 'express';

// Подключение контроллеров
import {
    getTicket,
    getAllTickets,
    setTicket,
    updateTicket,
    deleteTicket,
    deleteAllUserTickets
} from '../controllers/api-tickets-controller.js';

export const router = express.Router();

router.get('/api/ticket/:uid/:tid', getTicket);
router.get('/api/alltickets/:id', (req, res) => getAllTickets(req, res));
router.post('/api/ticket/:id', setTicket);
router.patch('/api/ticket/:id', updateTicket);
router.delete('/api/ticket/:id', deleteTicket);
router.delete('/api/allusertickets/:senderUserId/:targetUserId', deleteAllUserTickets);