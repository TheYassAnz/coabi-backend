import express from "express";
import eventCtrl from '../controllers/event';

const router = express.Router();

router.get('/', eventCtrl.getAllEvents);
router.get('/:id', eventCtrl.getEventById);
router.post('/', eventCtrl.createEvent);
router.put('/:id', eventCtrl.updateEvent);
router.delete('/:id', eventCtrl.deleteEvent);

export default router;