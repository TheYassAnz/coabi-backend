import express from "express";
const router = express.Router();
import accommodationCtrl from "../controllers/accommodation";

router.get("/", accommodationCtrl.getAllAccommodations);
router.post("/", accommodationCtrl.createAccommodation);

export default router;
