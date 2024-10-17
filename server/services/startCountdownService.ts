import "colors";
import Countdown, { ICountdown } from "../models/Countdown.js";

/**
 * @desc This service is used to start the countdown timer
 * @returns The countdown timer
 */
export async function startCountdownService(): Promise<ICountdown> {
  //check if there is a timer in the database, if not, create one
  const timer = await Countdown.findOne();
  if (!timer) {
    const newTimer = new Countdown({
      currentTime: 6480, //108 mins
      startTime: new Date(),
      isRunning: true,
      incidentOccurred: false,
      lastUpdated: new Date(),
      resetLogs: [],
      incidentLog: [],
      events: [],
    });
    await newTimer.save();
    console.log(
      `Dharma Initiative Countdown Timer Started (${new Date().toLocaleString()}) - `
        .green + `${newTimer.currentTime} seconds until the apocalypse`.red
    );
    return newTimer;
  }

  // Calculate time elapsed since the timer was last reset
  const secondsSinceStart = Math.floor(
    (new Date().getTime() - timer.startTime.getTime()) / 1000
  );

  const secondsRemaining = timer.currentTime - secondsSinceStart;

  // if the timer has finished, console log the incident, then reset the timer
  if (secondsRemaining <= 0) {
    const incidentTime = new Date(
      timer.startTime.getTime() + timer.currentTime * 1000
    );
    console.log(`APOCALYPSE STARTED AT (${incidentTime.toLocaleString()})`.red);
    timer.incidentOccurred = true;
    timer.incidentLog.push({
      incident: "Apocalypse",
      time: incidentTime,
    });
    //reset the timer
    timer.currentTime = 6480;
    timer.startTime = new Date();
    timer.isRunning = true;
    timer.incidentOccurred = false;
    timer.lastUpdated = new Date();
    timer.resetLogs.push({
      resetTime: new Date(),
    });

    await timer.save();
  } else {
    console.log(
      `The Dharma Initiative Countdown Timer Started ${timer.startTime} - `
        .green + `apocalypse in ${secondsRemaining} seconds.`.red
    );
  }

  //Step 3: if the timer is running, return it
  return timer;
}
