import express from "express";

import {
  getCountdown,
  resetCountdown,
  logIncident,
} from "../controllers/countdownController.js";

const router = express.Router();

router.get("/", getCountdown);
router.post("/reset", resetCountdown);
router.post("/incident", logIncident);

export default router;
