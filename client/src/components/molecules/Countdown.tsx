import { useTimer } from "../../contexts/TimerContext";
import { useEffect, useState, useRef } from "react";

interface CountdownProps {
  secsRemaining: number | null;
  onCountdownEnd?: () => void;
  onMinuteTick: () => void;
  startFinalCountdown: () => void;
}

export default function Countdown({
  secsRemaining,
  onCountdownEnd,
  onMinuteTick,
  startFinalCountdown,
}: CountdownProps) {
  const { startTime } = useTimer();

  const [hundreds, setHundreds] = useState(0); // Hundreds place for minutes
  const [tens, setTens] = useState(0); // Tens place for minutes
  const [ones, setOnes] = useState(0); // Ones place for minutes
  const [tenths, setTenths] = useState(0); // Tens place for seconds
  const [onesSec, setOnesSec] = useState(0); // Ones place for seconds
  const [isFinalCountdown, setIsFinalCountdown] = useState(false);

  const [endTime, setEndTime] = useState<Date | null>(null);

  const previousMinuteRef = useRef(Math.floor(secsRemaining! / 60));

  useEffect(() => {
    const FINAL_COUNTDOWN_THRESHOLD = 240; // 5 minutes in seconds

    const updateDigits = (timeInSeconds: number) => {
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = timeInSeconds % 60;

      setHundreds(Math.floor(minutes / 100));
      setTens(Math.floor((minutes % 100) / 10));
      setOnes(minutes % 10);

      if (timeInSeconds > 0 && timeInSeconds <= FINAL_COUNTDOWN_THRESHOLD) {
        if (!isFinalCountdown) {
          startFinalCountdown();
        }
        setIsFinalCountdown(true);
        setTenths(Math.floor(seconds / 10));
        setOnesSec(seconds % 10);
      }
      // Check if minute has changed
      if (minutes !== previousMinuteRef.current) {
        onMinuteTick();
        previousMinuteRef.current = minutes;
      }
    };

    let remainingTime = secsRemaining!;

    const interval = setInterval(() => {
      if (remainingTime <= 0) {
        console.log("Countdown ended");
        clearInterval(interval);
        onCountdownEnd?.();
        return;
      }

      updateDigits(remainingTime);
      remainingTime -= 1;
    }, 1000);

    // Initial update
    updateDigits(remainingTime);

    return () => {
      clearInterval(interval);
    };
  }, [secsRemaining, onCountdownEnd, onMinuteTick]);

  useEffect(() => {
    if (startTime) {
      //calc end time based on startTime + 109 minutes
      const endTime = new Date(startTime!.getTime() + 109 * 60 * 1000);
      setEndTime(endTime);
    }
  }, [startTime]);

  return (
    <>
      <div className="flip-clock bg-brown w-fit p-4 rounded-lg flex items-center justify-center">
        {/* Three digits for minutes */}
        <FlipCard digit={hundreds} />
        <FlipCard digit={tens} />
        <FlipCard digit={ones} />
        <span>:</span>
        {/* Two digits for seconds */}
        <FlipCard digit={tenths} isFinalCountdown={isFinalCountdown} />
        <FlipCard digit={onesSec} isFinalCountdown={isFinalCountdown} />
      </div>

      {/* Hidden - needed for dev */}
      <h1 className="hidden"> seconds remaining: {secsRemaining}</h1>
    </>
  );
}

// FlipCard component for rendering each digit
function FlipCard({
  digit,
  isFinalCountdown,
}: {
  digit: number;
  isFinalCountdown?: boolean;
}) {
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
      <div className="flip-card mx-[5px]">
        <div
          className={`flip-card-inner ${
            isFlipping ? "flipping" : ""
          }  relative w-[50px] h-[80px] `}
        >
          {/* Front face shows the previous digit */}
          <div
            className={`flip-card-front ${
              isFinalCountdown ? "final-countdown" : ""
            } `}
          >
            {previousDigit}
          </div>
          {/* Back face shows the new digit */}
          <div
            className={`flip-card-back ${
              isFinalCountdown ? "final-countdown" : ""
            }`}
          >
            {digit}
          </div>
        </div>
      </div>
    </>
  );
}
