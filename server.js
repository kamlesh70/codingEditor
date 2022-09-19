const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const cors = require("cors");

app.use(cors());
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(8000, (err) => {
  if (err) {
    console.log("error while connecting the express server", err);
    return;
  }
  console.log("server is running on port number 8000");
});
