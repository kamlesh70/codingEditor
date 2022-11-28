const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const ACTIONS = require("./src/socketAction");
const path = require("path");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const cors = require("cors");
app.use(cors());
app.use("/static", express.static(path.join(__dirname, "build")));
app.use(express.static(path.join(__dirname, "build")));

let mapClients = {};
const getAllClients = (roomId) => {
  let clients = [];
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((ele) => {
    return {
      user_name: mapClients[ele],
      socket_id: ele,
    };
  });
};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socket.on(ACTIONS.JOIN, ({ userName, roomId }) => {
    socket.join(roomId);
    mapClients[socket.id] = userName;
    let clients = getAllClients(roomId);
    console.log(clients);
    clients.forEach((client) => {
      io.to(client.socket_id).emit(ACTIONS.JOINED, {
        clients,
        user_name: userName,
        socket_id: socket.id,
      });
    });
  });

  socket.on(ACTIONS.CODE_SYNC, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_SYNC, { code });
  });

  socket.on(ACTIONS.FIRST_CONNECT, ({ code, socket_id }) => {
    io.to(socket_id).emit(ACTIONS.CODE_SYNC, { code });
  });

  socket.on(ACTIONS.LEAVE, ({ userName, roomId }) => {
    socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
      socket_id: socket.id,
      user_name: mapClients[socket.id],
    });
    socket.leave(roomId);
    delete mapClients[socket.id];
  });
  socket.on("disconnecting", () => {
    let rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socket_id: socket.id,
        user_name: mapClients[socket.id],
      });
    });
    socket.leave();
    delete mapClients[socket.id];
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

server.listen(8000, (err) => {
  if (err) {
    console.log("error while connecting the express server", err);
    return;
  }
  console.log("server is running on port number 8000");
});
