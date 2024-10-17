import { useState, useEffect } from "react";
import io from "socket.io-client";
import Message from "./components/atoms/Message";
import { Message as iMessage } from "./types/messageTypes";
import { ICountdown } from "./types/timerTypes";

const socket = io("http://localhost:5000");

function App() {
  const [messages, setMessages] = useState<iMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [timer, setTimer] = useState<ICountdown | null>(null);

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
    const response = await fetch("http://localhost:5000/api/countdown");
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

    console.log(`Time remaining: ${secondsRemaining} seconds`);
  }

  async function resetTimer() {
    //make a POST request to api/countdown/reset with params { user: "Tim", resetTime: new Date() }
    const response = await fetch("http://localhost:5000/api/countdown/reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: "Tim", resetTime: new Date() }),
    });
    if (response.ok) {
      console.log("Timer reset");
    } else {
      console.log("Failed to reset timer");
    }

    const timer = await response.json();
    console.log("updated Timer", timer);
  }

  return (
    <div className="App">
      <h1>The Swan Station</h1>
      <h3> Country Code: []</h3>
      <h3> Location: The Island</h3>
      <h3> Timer:</h3>
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
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      <button onClick={resetTimer}>Failsafe Reset</button>
    </div>
  );
}

export default App;
