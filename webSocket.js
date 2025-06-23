import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "https://318rkskl-3000.inc1.devtunnels.ms",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://318rkskl-3000.inc1.devtunnels.ms",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("joinRoom", ({ roomID, username }) => {
    socket.join(roomID);
    socket.username = username;
    socket.roomID = roomID;

    console.log(`Client ${username} (${socket.id}) joined room ${roomID}`);
    socket.to(roomID).emit("userJoined", {
      roomID,
      username,
    });
  });

  socket.on("sendMessage", ({ roomID, message, sender }) => {
    io.to(roomID).emit("receiveMessage", { sender, message });
    console.log(`Message sent to room ${roomID}:`, message);
  });

  socket.on("disconnect", () => {
    const { roomID, username } = socket;
    if (roomID && username) {
      socket.to(roomID).emit("userLeft", {
        roomID,
        username,
      });
      console.log(`${username} disconnected from room ${roomID}`);
    } else {
      console.log("Client disconnected:", socket.id);
    }
  });
});

const port = 3002;
server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});
