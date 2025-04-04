import express from "express";
import eventCtrl from "../controllers/event";

const router = express.Router();

router.get("/", authMiddleware, eventCtrl.getAllEvents);
router.get("/:id", authMiddleware, eventCtrl.getEventById);
router.post("/", authMiddleware, eventCtrl.createEvent);
router.put("/:id", authMiddleware, eventCtrl.updateEvent);
router.delete("/:id", authMiddleware, eventCtrl.deleteEvent);

export default router;
