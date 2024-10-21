//TODO: https://codepen.io/nathan815/pen/MBJzOE
import "./App.css";

import { useState, useEffect, useRef } from "react";
import { Message as iMessage } from "./types/messageTypes";
import { ICountdown } from "./types/timerTypes";
import Countdown from "./components/molecules/Countdown";
import Terminal from "./components/molecules/Terminal";
import AudioPlayer from "./components/molecules/JukeBox";

import dharmaLogo from "./assets/png/dharma_logo_black.png";
import Message from "./components/atoms/Message";
import { socket } from "./socket";

import { useTimer } from "./contexts/TimerContext";
import { playAudio } from "./utils/audioHelpers";
import Computer from "./components/molecules/Computer";

function App() {
  const { setTimer, secondsRemaining } = useTimer();

  const [localSecondsRemaining, setLocalSecondsRemaining] =
    useState(secondsRemaining);

  const [messages, setMessages] = useState<iMessage[]>([]);

  const [isFinalCountdown, setIsFinalCountdown] = useState(false);

  const minuteTickAudioRef = useRef<HTMLAudioElement>(null);
  const resetAudioRef = useRef<HTMLAudioElement>(null);
  const pongAudioRef = useRef<HTMLAudioElement>(null);

  async function resetTimer() {
    try {
      stopFinalCountdown();
      socket.emit("resetTimer", "anonymous", new Date());
      setTimer(new Date(), 108 * 60); // 108 minutes in seconds

      playAudio(resetAudioRef);
    } catch (error) {
      console.error("Failed to reset timer", error);
    }
  }

  function startFinalCountdown() {
    setIsFinalCountdown(true);
    console.log("Final countdown started");
  }

  function stopFinalCountdown() {
    setIsFinalCountdown(false);
    console.log("Final countdown stopped");
  }

  useEffect(() => {
    let minuteTickInterval: NodeJS.Timeout;
    let pongInterval: NodeJS.Timeout;

    playAudio(minuteTickAudioRef);

    if (isFinalCountdown) {
      minuteTickInterval = setInterval(() => {
        playAudio(minuteTickAudioRef);
      }, 1000); // Play every 60 seconds (1 minute)

      pongInterval = setInterval(() => {
        playAudio(pongAudioRef);
      }, 2000); // Play every second
    }

    // Cleanup function
    return () => {
      if (minuteTickInterval) clearInterval(minuteTickInterval);
      if (pongInterval) clearInterval(pongInterval);
    };
  }, [isFinalCountdown]); // This effect runs when isFinalCountdown changes

  // useEffects

  useEffect(() => {
    setLocalSecondsRemaining(secondsRemaining);
  }, [secondsRemaining]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLocalSecondsRemaining((prevSeconds) => Math.max(prevSeconds - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMessage = (message: iMessage) => {
      message.username = message.username || "Anonymous";
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    const handleTimer = (timer: ICountdown) => {
      console.log("Received timer", timer);
      const startTime = new Date(timer.startTime);
      const secondsElapsed = Math.floor(
        (new Date().getTime() - startTime.getTime()) / 1000
      );
      const remainingSeconds = Math.max(0, timer.currentTime - secondsElapsed);
      setTimer(startTime, remainingSeconds);
    };

    socket.on("message", handleMessage);
    socket.on("timer", handleTimer);

    // Cleanup function to remove the listener when the component unmounts
    return () => {
      socket.off("message", handleMessage);
      socket.off("timer", handleTimer);
    };
  }, [setTimer]); // Add setTimer to the dependency array

  return (
    <div className="App">
      <div className="swan-wrapper flex flex-col items-center content-center">
        <img
          src={dharmaLogo}
          className="my-4 md:my-8"
          alt="DHARMA INITIATIVE - SWAN STATION"
        />

        <div className="flex flex-col my-4 md:my-8">
          <Countdown
            secsRemaining={localSecondsRemaining}
            onMinuteTick={() => playAudio(minuteTickAudioRef)}
            startFinalCountdown={startFinalCountdown}
          />
        </div>

        <Computer>
          <div className="entry">
            <Terminal
              secsRemaining={localSecondsRemaining}
              resetTimer={resetTimer}
            />
          </div>
        </Computer>

        <div className="flex flex-col my-4 border ">
          <h3> Location: The Island </h3>
          <h3> Country Code: N/A</h3>
        </div>

        <AudioPlayer
          minuteTickAudioRef={minuteTickAudioRef}
          resetAudioRef={resetAudioRef}
          pongAudioRef={pongAudioRef}
        />

        <div className="messages">
          {messages.map((message, index) => (
            <Message
              key={index}
              username={message.username}
              text={message.text}
            />
          ))}
        </div>

        <button onClick={startFinalCountdown}>
          test final countdown sequence
        </button>
        <button onClick={stopFinalCountdown}> stop final countdown </button>
        {/* <div className="input-box">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={handleKeyPress}
        />
        <button onClick={sendMessage}>Send</button>
      </div> */}

        <p> 4 8 15 16 23 42</p>
      </div>
    </div>
  );
}

export default App;
