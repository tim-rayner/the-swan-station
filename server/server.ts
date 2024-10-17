import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

const server = createServer(app);

const io: Server = new Server(server, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

io.on("connection", (socket: Socket) => {
  console.log("New user connected");

  socket.on("sendMessage", (message: string) => {
    io.emit("message", message); // Broadcast the message to all connected clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
