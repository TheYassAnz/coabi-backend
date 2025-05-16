import express from "express";
const router = express.Router();
import accommodationCtrl from "../controllers/accommodation";
import authMiddleware from "../middleware/auth";
import { validateObjectId } from "../middleware/object-id-validation";

router.get("/", authMiddleware, accommodationCtrl.getAllAccommodations);
router.post("/", authMiddleware, accommodationCtrl.createAccommodation);
router.get(
  "/:id",
  authMiddleware,
  validateObjectId,
  accommodationCtrl.getAccommodationById,
);
router.patch(
  "/:id",
  authMiddleware,
  validateObjectId,
  accommodationCtrl.updateAccommodationById,
);
router.delete(
  "/:id",
  authMiddleware,
  validateObjectId,
  accommodationCtrl.deleteAccommodationById,
);

export default router;
