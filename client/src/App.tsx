//TODO: https://codepen.io/nathan815/pen/MBJzOE

import { useState, useEffect, useRef } from "react";
import { Message as iMessage } from "./types/messageTypes";
import { ICountdown } from "./types/timerTypes";
import Countdown from "./components/molecules/Countdown";
import "./App.css";
import Terminal from "./components/molecules/Terminal";
import AudioPlayer from "./components/molecules/JukeBox";
import { playAudio } from "./utils/audioHelpers";
import dharmaLogo from "./assets/png/dharma_logo_black.png";
import Message from "./components/atoms/Message";
import { socket } from "./socket";

import { useTimer } from "./contexts/TimerContext";

function App() {
  const { setTimer, secondsRemaining } = useTimer();

  const [localSecondsRemaining, setLocalSecondsRemaining] =
    useState(secondsRemaining);

  const [messages, setMessages] = useState<iMessage[]>([]);
  const [messageText, setMessageText] = useState("");

  const minuteTickAudioRef = useRef<HTMLAudioElement>(null);
  const resetAudioRef = useRef<HTMLAudioElement>(null);

  function sendMessage() {
    if (messageText === "") {
      return;
    }

    socket.emit("sendMessage", { text: messageText, username: "Tim" });
    setMessageText("");
  }

  async function resetTimer() {
    try {
      socket.emit("resetTimer", "anonymous", new Date());
      setTimer(new Date(), 108 * 60); // 108 minutes in seconds
      playAudio(resetAudioRef);
    } catch (error) {
      console.error("Failed to reset timer", error);
    }
  }

  function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      sendMessage();
    }
  }

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

  // Calculate minutes and seconds from secondsRemaining
  const minsRemaining = Math.floor(secondsRemaining / 60);

  return (
    <div className="App">
      <div className="swan-wrapper items-center content-center flex flex-col">
        <img
          src={dharmaLogo}
          className="my-4 md:my-8"
          alt="DHARMA INITIATIVE - SWAN STATION"
        />

        <div className="flex flex-col my-4 md:my-8">
          <Countdown
            secsRemaining={localSecondsRemaining}
            onMinuteTick={() => playAudio(minuteTickAudioRef)}
          />
        </div>

        <Terminal minsRemaining={minsRemaining} resetTimer={resetTimer} />

        <div className="flex flex-col my-4">
          <h3> Location: The Island </h3>
          <h3> Country Code: N/A</h3>
        </div>

        <AudioPlayer
          minuteTickAudioRef={minuteTickAudioRef}
          resetAudioRef={resetAudioRef}
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
