import "colors";
import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";

//Route imports
import countdownRouter from "./routes/countdown.js";

//Configuration
dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;
const app = express();

//Add middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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

//Add routes
app.use("/api/countdown", countdownRouter);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//Socket listeners
io.on("connection", (socket: Socket) => {
  console.log("New user connected");

  socket.on("sendMessage", (message: string) => {
    io.emit("message", message); // Broadcast the message to all connected clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
