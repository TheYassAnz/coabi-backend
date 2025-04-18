import express from "express";
import eventCtrl from "../controllers/event";

const router = express.Router();

router.get("/", eventCtrl.getAllEvents);
router.get("/filter", eventCtrl.filterEvents);
router.post("/", eventCtrl.createEvent);
router.get("/:id", eventCtrl.getEventById);
router.patch("/:id", eventCtrl.updateEventById);
router.delete("/:id", eventCtrl.deleteEventById);

export default router;
