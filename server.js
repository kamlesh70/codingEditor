const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const ACTIONS = require("./src/socketAction");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const cors = require("cors");
app.use(cors());

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
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
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
  socket.on(ACTIONS.LEAVE, ({ userName, roomId }) => {
    socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
      socket_id: socket.id,
      user_name: mapClients[socket.id],
    });
    socket.leave(roomId);
    delete mapClients[socket.id];
  });
  // socket.on("disconnecting", () => {
  //   let rooms = [...socket.rooms];
  //   rooms.forEach((roomId) => {
  //     socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
  //       socket_id: socket.id,
  //       user_name: mapClients[socket.id],
  //     });
  //   });
  //   delete mapClients[socket.id];
  //   socket.leave();
  // });
});

server.listen(8000, (err) => {
  if (err) {
    console.log("error while connecting the express server", err);
    return;
  }
  console.log("server is running on port number 8000");
});
