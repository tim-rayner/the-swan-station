import { useState, useEffect } from "react";
import io from "socket.io-client";
import Message from "./components/atoms/Message";
import { Message as iMessage } from "./types/messageTypes";

const socket = io("http://localhost:5000");

function App() {
  const [messages, setMessages] = useState<iMessage[]>([]);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
  }, [messages]);

  const sendMessage = () => {
    socket.emit("sendMessage", { text: messageText });
    setMessageText("");
  };

  return (
    <div className="App">
      <h1>The Swan Station</h1>
      <h3> Country Code: []</h3>
      <h3> Location: The Island</h3>
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
    </div>
  );
}

export default App;
