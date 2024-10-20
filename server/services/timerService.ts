import Countdown, { ICountdown } from "../models/Countdown.js"; // Adjust the import path as needed

export async function resetTimer(
  user: string,
  resetTime: Date
): Promise<ICountdown> {
  // Implement the logic to reset the timer
  // This might involve updating a database, recalculating values, etc.
  // Return the updated timer object

  const countdown = await Countdown.findOne();

  if (!countdown) {
    throw new Error("No countdown state found");
  }

  countdown.resetLogs.push({
    resetTime: resetTime,
    user: user,
  });

  countdown.currentTime = 6540; //6540
  countdown.startTime = new Date();
  countdown.isRunning = true;
  countdown.incidentOccurred = false;
  countdown.lastUpdated = new Date();

  await countdown.save();

  return countdown;
}
