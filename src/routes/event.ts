import express from "express";
import eventCtrl from "../controllers/event";
import authMiddleware from "../middleware/auth";
import { validateObjectId } from "../middleware/object-id-validation";
import {
  validateAccommodationReference,
  validateUserReference,
} from "../middleware/validate-references";

const router = express.Router();

router.get("/", authMiddleware, eventCtrl.getAllEvents);
router.get("/filter", authMiddleware, eventCtrl.filterEvents);
router.post(
  "/",
  authMiddleware,
  validateAccommodationReference,
  validateUserReference,
  eventCtrl.createEvent,
);
router.get("/:id", authMiddleware, validateObjectId, eventCtrl.getEventById);
router.patch(
  "/:id",
  authMiddleware,
  validateObjectId,
  eventCtrl.updateEventById,
);
router.delete(
  "/:id",
  authMiddleware,
  validateObjectId,
  eventCtrl.deleteEventById,
);

export default router;
