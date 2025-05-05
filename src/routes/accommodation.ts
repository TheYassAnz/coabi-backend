import express from "express";
const router = express.Router();
import accommodationCtrl from "../controllers/accommodation";
import authMiddleware from "../middleware/auth";

router.get("/", authMiddleware, accommodationCtrl.getAllAccommodations);
router.post("/", authMiddleware, accommodationCtrl.createAccommodation);
router.get("/:id", authMiddleware, accommodationCtrl.getAccommodationById);
router.patch("/:id", authMiddleware, accommodationCtrl.updateAccommodationById);
router.delete(
  "/:id",
  authMiddleware,
  accommodationCtrl.deleteAccommodationById,
);

export default router;
