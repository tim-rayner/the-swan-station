import asyncHandler from "express-async-handler";
import CountdownModel from "../models/Countdown.js";

// @route GET /countdown
// @desc Get the current countdown state
const getCountdown = asyncHandler(async (req, res) => {
  try {
    const countdown = await CountdownModel.findOne();
    res.status(200).json(countdown);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve countdown state",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// @route POST /countdown/reset
// @desc Reset the countdown and log the event
const resetCountdown = asyncHandler(async (req, res) => {
  try {
    const { user, resetTime } = req.body;

    const countdown = await CountdownModel.findOne();

    if (!countdown) {
      res.status(404);
      throw new Error("No countdown state found");
    }

    countdown.resetLogs.push({ resetTime, user });
    countdown.currentTime = 6480;
    countdown.startTime = new Date();
    countdown.isRunning = true;
    countdown.incidentOccurred = false;
    countdown.lastUpdated = new Date();

    await countdown.save();
    res.status(200).json(countdown);
  } catch (error) {
    res.status(500).json({
      message: "Failed to reset countdown",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// @route POST /countdown/incident
// @desc Log an incident when the countdown reaches zero
const logIncident = asyncHandler(async (req, res) => {
  try {
    const countdown = await CountdownModel.findOne();

    if (!countdown) {
      res.status(404);
      throw new Error("No countdown state found");
    }

    countdown.incidentLogs.push({ incidentTime: new Date() });
    await countdown.save();

    res.status(200).json(countdown);
  } catch (error) {
    res.status(500).json({
      message: "Failed to log incident",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

export { getCountdown, resetCountdown, logIncident };
