//TODO: https://codepen.io/nathan815/pen/MBJzOE

import { useState, useEffect, useRef, useCallback } from "react";
import io from "socket.io-client";
import { Message as iMessage } from "./types/messageTypes";
import { ICountdown } from "./types/timerTypes";
import Countdown from "./components/molecules/Countdown";
import "./App.css";
import Terminal from "./components/molecules/Terminal";
import AudioPlayer from "./components/molecules/JukeBox";
import { playAudio } from "./utils/audioHelpers";
import NewCountdown from "./components/molecules/newCountdown";
import Message from "./components/atoms/Message";

const API_URL = process.env.REACT_APP_API_URL || "";
const socket = io(process.env.REACT_APP_API_URL || "");

function App() {
  const [messages, setMessages] = useState<iMessage[]>([]);
  const [messageText, setMessageText] = useState("");

  const [minsRemaining, setMinsRemaining] = useState<number | null>(null);
  const [secsRemaining, setSecsRemaining] = useState<number | null>(null);

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
      setMinsRemaining(108);
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

  //temp makeshift count down 1 min and update minsRemaining - this will be replaced with synchronisation with the server
  useEffect(() => {
    const interval = setInterval(() => {
      setMinsRemaining((prevMins) => (prevMins ? prevMins - 1 : null));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMessage = (message: iMessage) => {
      message.username = message.username || "Anonymous";
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    const handleTimer = (timer: ICountdown) => {
      console.log("Received timer", timer);

      // Convert startTime string to Date object
      const startTime = new Date(timer.startTime);

      const secondsElapsed = Math.floor(
        (new Date().getTime() - startTime.getTime()) / 1000
      );

      const secondsRemaining = timer.currentTime - secondsElapsed;

      setMinsRemaining(Math.floor(secondsRemaining / 60));

      console.log(`Time remaining: ${secondsRemaining} seconds`);
    };

    socket.on("message", handleMessage);
    socket.on("timer", handleTimer);

    // Cleanup function to remove the listener when the component unmounts
    return () => {
      socket.off("message", handleMessage);
      socket.off("timer", handleTimer);
    };
  }, []); // Empty dependency array

  return (
    <div className="App">
      <h1>The Swan Station</h1>
      <h3> Country Code: []</h3>
      <h3> Location: The Island </h3>

      <Countdown
        minsRemaining={minsRemaining ?? 0}
        secsRemaining={secsRemaining ?? 0}
        onMinuteTick={() => playAudio(minuteTickAudioRef)}
      />
      <NewCountdown socket={socket} />

      <Terminal resetTimer={resetTimer} minsRemaining={minsRemaining ?? 0} />

      <AudioPlayer
        minuteTickAudioRef={minuteTickAudioRef}
        resetAudioRef={resetAudioRef}
      />
      <button onClick={() => playAudio(resetAudioRef)}>Reset</button>
      <button onClick={() => playAudio(minuteTickAudioRef)}>Tick</button>

      <div className="messages">
        {messages.map((message, index) => (
          <Message
            key={index}
            username={message.username}
            text={message.text}
          />
        ))}
      </div>
      <div className="input-box">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={handleKeyPress}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      <button onClick={resetTimer}>Failsafe Reset</button>
      <p> 4 8 15 16 23 42</p>
    </div>
  );
}

export default App;
