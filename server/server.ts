import "colors";
import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";

//Route imports
import countdownRouter from "./routes/countdown.js";
import { startCountdownService } from "./services/startCountdownService.js";
import { resetTimer } from "./services/timerService.js";

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

//entry
dotenv.config();
connectDB();

//Start the countdown timer
let timer = await startCountdownService();

if (timer.incidentOccurred) {
  io.emit("incident", timer);
}

//Socket listeners
io.on("connection", (socket: Socket) => {
  console.log("New user connected", socket.id);

  socket.emit("timer", timer);

  //call own reset api on reset event recieved
  socket.on("resetTimer", async (user: string, resetTime: Date) => {
    console.log("Resetting timer");
    try {
      const updatedTimer = await resetTimer(user, new Date(resetTime));
      timer = updatedTimer;
      io.emit("timer", updatedTimer); // Broadcast the updated timer to all clients
    } catch (error) {
      console.error("Error resetting timer:", error);
      socket.emit("error", "Failed to reset timer");
    }
  });

  socket.on("sendMessage", (message: string) => {
    console.log("Received message", message);
    io.emit("message", message); // Broadcast the message to all connected clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
