import express from "express";
const router = express.Router();
import accommodationCtrl from "../controllers/accommodation";

router.get("/", accommodationCtrl.getAllAccommodations);
router.post("/", accommodationCtrl.createAccommodation);
router.get("/:id", accommodationCtrl.getAccommodationById);
router.put("/:id", accommodationCtrl.updateAccommodationById);

export default router;
