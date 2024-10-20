import { useTimer } from "../../contexts/TimerContext";
import { useEffect, useState } from "react";

interface CountdownProps {
  secsRemaining: number | null;
  onCountdownEnd?: () => void;
  onMinuteTick: () => void;
}

export default function Countdown({
  secsRemaining,
  onCountdownEnd,
  onMinuteTick,
}: CountdownProps) {
  const { startTime } = useTimer();

  const [hundreds, setHundreds] = useState(0); // Hundreds place for minutes
  const [tens, setTens] = useState(0); // Tens place for minutes
  const [ones, setOnes] = useState(0); // Ones place for minutes
  const [tenths, setTenths] = useState(0); // Tens place for seconds
  const [onesSec, setOnesSec] = useState(0); // Ones place for seconds

  const [endTime, setEndTime] = useState<Date | null>(null);

  useEffect(() => {
    const FINAL_COUNTDOWN_THRESHOLD = 240; // 5 minutes in seconds

    let previousMinute = Math.floor(secsRemaining! / 60);

    const updateDigits = (timeInSeconds: number) => {
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = timeInSeconds % 60;

      setHundreds(Math.floor(minutes / 100));
      setTens(Math.floor((minutes % 100) / 10));
      setOnes(minutes % 10);

      const isFinalCountdown = timeInSeconds <= FINAL_COUNTDOWN_THRESHOLD;
      setTenths(isFinalCountdown ? Math.floor(seconds / 10) : 0);
      setOnesSec(isFinalCountdown ? seconds % 10 : 0);

      // Check if minute has changed
      if (minutes !== previousMinute) {
        onMinuteTick();
        previousMinute = minutes;
      }
    };

    const interval = setInterval(() => {
      if (secsRemaining! <= 0) {
        clearInterval(interval);
        onCountdownEnd?.();
        return;
      }

      secsRemaining! -= 1;
      updateDigits(secsRemaining!);
    }, 1000);

    // Initial update
    updateDigits(secsRemaining!);

    return () => clearInterval(interval);
  }, [secsRemaining, onCountdownEnd]);

  useEffect(() => {
    if (startTime) {
      //calc end time based on startTime + 109 minutes
      const endTime = new Date(startTime!.getTime() + 109 * 60 * 1000);
      setEndTime(endTime);
    }
  }, [startTime]);

  return (
    <>
      <h1>
        Countdown to {endTime?.toLocaleTimeString()} || started:
        {startTime?.toLocaleTimeString()}
        seconds remaining: {secsRemaining}
      </h1>

      <div className="flip-clock">
        {/* Three digits for minutes */}
        <FlipCard digit={hundreds} />
        <FlipCard digit={tens} />
        <FlipCard digit={ones} />
        <span>:</span>
        {/* Two digits for seconds */}
        <FlipCard digit={tenths} />
        <FlipCard digit={onesSec} />
      </div>
    </>
  );
}

// FlipCard component for rendering each digit
function FlipCard({ digit }: { digit: number }) {
  const [previousDigit, setPreviousDigit] = useState(digit);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (digit !== previousDigit) {
      setIsFlipping(true);
      setTimeout(() => {
        setIsFlipping(false);
        setPreviousDigit(digit);
      }, 600); // Duration of the flip animation
    }
  }, [digit, previousDigit]);

  return (
    <>
      <div className="flip-card">
        <div className={`flip-card-inner ${isFlipping ? "flipping" : ""}`}>
          {/* Front face shows the previous digit */}
          <div className="flip-card-front">{previousDigit}</div>
          {/* Back face shows the new digit */}
          <div className="flip-card-back">{digit}</div>
        </div>
      </div>
    </>
  );
}
