import express from "express";
import eventCtrl from "../controllers/event";
import authMiddleware from "../middleware/auth";

const router = express.Router();

router.get("/", authMiddleware, eventCtrl.getAllEvents);
router.get("/filter", authMiddleware, eventCtrl.filterEvents);
router.post("/", authMiddleware, eventCtrl.createEvent);
router.get("/:id", authMiddleware, eventCtrl.getEventById);
router.patch("/:id", authMiddleware, eventCtrl.updateEventById);
router.delete("/:id", authMiddleware, eventCtrl.deleteEventById);

export default router;
