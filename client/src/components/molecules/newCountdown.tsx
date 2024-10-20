import React, { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import CountdownService from "../../services/countdownService";

interface CountdownTimerProps {
  socket: Socket;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ socket }) => {
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [countdownService] = useState(() => new CountdownService(socket));

  useEffect(() => {
    // Sync with server when component mounts
    countdownService.syncWithServer();

    // Set up interval to update remaining time
    const intervalId = setInterval(() => {
      const time = countdownService.getRemainingTime();
      setRemainingTime(time);
    }, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [countdownService]);

  // Convert milliseconds to a more readable format
  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    return `${hours.toString().padStart(2, "0")}:${(minutes % 60)
      .toString()
      .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
  };

  return (
    <div>
      <h2>Countdown Timer</h2>
      <p>Time Remaining: {formatTime(remainingTime)}</p>
    </div>
  );
};

export default CountdownTimer;
