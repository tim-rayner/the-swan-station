import React, { useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function BasicChat() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
  }, []);

  return (
    <div className="App">
      <h1>Real-Time Chat App</h1>
      {/* Chat interface components */}
    </div>
  );
}
