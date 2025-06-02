import express from "express";
import bodyParser from "body-parser";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: true,
});

// MIDDLEWARES
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// APIs
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const emailToSocketIDMap = new Map();
const socketIDToEmailMap = new Map();

// SOCKET.IO Logic
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join-room", (data) => {
    const { roomID, email } = data;
    // socket.broadcast.to(roomID).emit('user-joined', { email, roomID });
    emailToSocketIDMap.set(email, socket.id);
    socketIDToEmailMap.set(socket.id, email);

    // Join the room
    socket.to(roomID).emit("joined-room", data);
    socket.join(roomID);

    // for the user who just joined in the the room
    io.to(roomID).emit("user-joined", {
      email,
      roomID,
      socketId: socket.id, // Send this so others know who joined
    });
    socket.emit("user-joined", {
      email,
      roomID,
      socketId: socket.id, // Send this so others know who joined
    });
    socket.join(roomID);

    console.log(`${email} joined the room ${roomID}`);
  });

  // to share the video and audio stream
  socket.on("user:broadcast", (data) => {
    const { to, offer } = data;
    console.log(`Broadcasting offer to ${to}`);
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });
  socket.on("call:accepted", (data) => {
    const { to, ans } = data;
    console.log(`Answering call to ${to}`);
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:negotiation", (data) => {
    const { to, offer } = data;
    console.log(`Negotiating peer connection with ${to}`);
    io.to(to).emit("peer:negotiation", { from: socket.id, offer });
  });

  socket.on("peer:negotiation:done", (data) => {
    const { to, ans } = data;
    console.log(`Peer negotiation done with ${to}`);
    io.to(to).emit("peer:negotiation:", { from: socket.id, ans });
  });
  // socket.on('disconnect', () => {
  //   console.log('User disconnected');
  // });
});

server.listen(8000, () => {
  console.log("Server (HTTP + WebSocket) running on port 8000");
});
