const express = require("express");
const router = express.Router();

const accommodationCtrl = require("../controllers/accommodation");

router.get("/", accommodationCtrl.getAllAccommodations);
router.post("/", accommodationCtrl.createAccommodation);

module.exports = router;
