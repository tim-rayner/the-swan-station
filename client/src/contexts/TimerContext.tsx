import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { socket } from "../socket";

interface TimerContextType {
  startTime: Date | null;
  currentTime: number;
  secondsRemaining: number;
  minsRemaining: number;
  secsRemaining: number;
  setTimer: (startTime: Date, durationInSeconds: number) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);

  const setTimer = useCallback((startTime: Date, durationInSecs: number) => {
    const timeNow = new Date();
    const secondsElapsed = Math.floor(
      (timeNow.getTime() - startTime.getTime()) / 1000
    );
    const newSecondsRemaining = Math.max(durationInSecs - secondsElapsed, 0);

    setStartTime(startTime);
    setSecondsRemaining(newSecondsRemaining);
  }, []);

  useEffect(() => {
    if (startTime && secondsRemaining > 0) {
      const interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor(
          (now.getTime() - startTime.getTime()) / 1000
        );
        const remaining = Math.max(secondsRemaining - elapsed, 0);

        setCurrentTime(remaining);

        if (remaining === 0) {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [startTime, secondsRemaining]);

  useEffect(() => {
    const handleTimer = (timer: { startTime: string; currentTime: number }) => {
      setTimer(new Date(timer.startTime), timer.currentTime);
    };

    socket.on("timer", handleTimer);

    return () => {
      socket.off("timer", handleTimer);
    };
  }, [setTimer]);

  const minsRemaining = Math.floor(currentTime / 60);
  const secsRemaining = currentTime % 60;

  return (
    <TimerContext.Provider
      value={{
        startTime,
        currentTime,
        secondsRemaining,
        minsRemaining,
        secsRemaining,
        setTimer,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
};
