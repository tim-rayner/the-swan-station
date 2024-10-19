//TODO: https://codepen.io/nathan815/pen/MBJzOE

import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { Message as iMessage } from "./types/messageTypes";
import { ICountdown } from "./types/timerTypes";
import Countdown from "./components/molecules/Countdown";

import "./App.css";
import Terminal from "./components/molecules/Terminal";
import AudioPlayer from "./components/molecules/JukeBox";
import { playAudio } from "./services/audioHelpers";

const API_URL = process.env.REACT_APP_API_URL || "";
const socket = io(process.env.REACT_APP_API_URL || "");

function App() {
  const [messages, setMessages] = useState<iMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [timer, setTimer] = useState<ICountdown | null>(null);
  const [minsRemaining, setMinsRemaining] = useState<number | null>(null);

  const minuteTickAudioRef = useRef<HTMLAudioElement>(null);
  const resetAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
  }, [messages]);

  useEffect(() => {
    fetchData();
  }, []);

  //

  const sendMessage = () => {
    socket.emit("sendMessage", { text: messageText });
    setMessageText("");
  };

  async function fetchData() {
    const response = await fetch(`${API_URL}/api/countdown`);
    const timerData: ICountdown = await response.json();
    console.log(timerData);
    // Convert startTime string to Date object
    const startTime = new Date(timerData.startTime);
    const secondsElapsed = Math.floor(
      (new Date().getTime() - startTime.getTime()) / 1000
    );
    const secondsRemaining = timerData.currentTime - secondsElapsed;
    setTimer({
      ...timerData,
      startTime: startTime,
    });
    setMinsRemaining(Math.floor(secondsRemaining / 60));
    console.log(`Time remaining: ${secondsRemaining} seconds`);
  }

  async function resetTimer() {
    //make a POST request to api/countdown/reset with params { user: "Tim", resetTime: new Date() }
    const response = await fetch(`${API_URL}/api/countdown/reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: "Tim", resetTime: new Date() }),
    });
    if (response.ok) {
      console.log("Timer reset");
      playAudio(resetAudioRef);

      const timer = await response.json();

      setMinsRemaining(108);

      console.log("updated Timer", timer);
    } else {
      console.log("Failed to reset timer");
    }
  }

  //temp makeshift count down 1 min and update minsRemaining - this will be replaced with synchronisation with the server
  useEffect(() => {
    const interval = setInterval(() => {
      setMinsRemaining((prevMins) => (prevMins ? prevMins - 1 : null));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <h1>The Swan Station</h1>
      <h3> Country Code: []</h3>
      <h3> Location: The Island </h3>

      <Countdown
        minsRemaining={minsRemaining ?? 0}
        onMinuteTick={() => playAudio(minuteTickAudioRef)}
      />
      <Terminal resetTimer={resetTimer} minsRemaining={minsRemaining ?? 0} />
      <AudioPlayer
        minuteTickAudioRef={minuteTickAudioRef}
        resetAudioRef={resetAudioRef}
      />
      <button onClick={() => playAudio(resetAudioRef)}>Reset</button>
      <button onClick={() => playAudio(minuteTickAudioRef)}>Tick</button>
      {/* <div className="messages">
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
        />
        <button onClick={sendMessage}>Send</button>
      </div> */}

      <button onClick={resetTimer}>Failsafe Reset</button>
      <p> 4 8 15 16 23 42</p>
    </div>
  );
}

export default App;
