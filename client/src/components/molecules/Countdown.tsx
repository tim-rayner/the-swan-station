import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

interface CountdownProps {
  minsRemaining: number | null;
  onCountdownEnd?: () => void;
}

export default function Countdown({
  minsRemaining = null,
  onCountdownEnd,
}: CountdownProps) {
  const [hundreds, setHundreds] = useState(0); // Hundreds place for minutes
  const [tens, setTens] = useState(0); // Tens place for minutes
  const [ones, setOnes] = useState(0); // Ones place for minutes
  const [tenths, setTenths] = useState(0); // Tens place for seconds
  const [onesSec, setOnesSec] = useState(0); // Ones place for seconds

  useEffect(() => {
    const FINAL_COUNTDOWN_THRESHOLD = 240; // 5 minutes in seconds
    let totalTimeRemaining = minsRemaining ? minsRemaining * 60 : 0;

    const updateDigits = (timeInSeconds: number) => {
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = timeInSeconds % 60;

      setHundreds(Math.floor(minutes / 100));
      setTens(Math.floor((minutes % 100) / 10));
      setOnes(minutes % 10);

      const isFinalCountdown = timeInSeconds <= FINAL_COUNTDOWN_THRESHOLD;
      setTenths(isFinalCountdown ? Math.floor(seconds / 10) : 0);
      setOnesSec(isFinalCountdown ? seconds % 10 : 0);
    };

    const interval = setInterval(() => {
      if (totalTimeRemaining <= 0) {
        clearInterval(interval);
        onCountdownEnd?.();
        return;
      }

      totalTimeRemaining -= 1;
      updateDigits(totalTimeRemaining);
    }, 1000);

    // Initial update
    updateDigits(totalTimeRemaining);

    return () => clearInterval(interval);
  }, [minsRemaining, onCountdownEnd]);

  return (
    <div>
      <h1>Countdown</h1>
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
    </div>
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
    <div className="flip-card">
      <div className={`flip-card-inner ${isFlipping ? "flipping" : ""}`}>
        {/* Front face shows the previous digit */}
        <div className="flip-card-front">{previousDigit}</div>
        {/* Back face shows the new digit */}
        <div className="flip-card-back">{digit}</div>
      </div>
    </div>
  );
}
