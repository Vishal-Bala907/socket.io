import express from "express";

import { Server } from "socket.io";
import { createServer } from "http";
const PORT = 4000;

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("user connected {} ", socket.id);

  // send message to particular socket
  socket.emit("welcome", `welcome to the server ${socket.id}`);

  // send message to every one except this user
  // socket.broadcast.emit(`User ${socket.id} has joined the chat`);

  // receiving messages
  /*  socket.on("message", (message) => {
    console.log("message from front-end ", message);
    socket.broadcast.emit("message", message);
  });
*/
  // receiving message with roomId and sending to a particular room
  socket.on("mgs-rec", ({ message, roomID }) => {
    console.log("message from front-end ", message, roomID);
    const room = roomID;
    const msg = message;
    io.to(roomID).emit("personal", { msg, room });
  });
});

app.get("/api", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
