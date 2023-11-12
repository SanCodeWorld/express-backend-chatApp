const express = require("express");
const app = express();
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");

const { addUsers, removeUser, getUser, getUsersInRoom } = require("./users");

const server = http.createServer(app);

const router = require("./router");

const PORT = process.env.PORT || 5000;

const io = socketio(server, {
  cors: {
    origin: "https://voluble-sherbet-84d5dd.netlify.app/",
  },
});

app.use(router);
app.use(cors());

io.on("connection", (socket) => {
  socket.on("join", ({ name, room }) => {
    const user = addUsers({ id: socket.id, name, room });
    // console.log(`${user.name} joined in ${room}`);

    socket.emit("message", {
      user: "admin",
      text: `${user.name} welcome to the chatroom ${room}`,
    });
    socket.broadcast.to(user.room).emit("message", {
      user: "admin",
      text: `${user.name} joined the chatroom`,
    });

    socket.join(user.room);

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
  });

  socket.on("sendMessage", (msg, cb) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: msg });

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    cb();
  });

  socket.on("disconnect", () => {
    // console.log("user left");
    const user = removeUser(socket.id);
    console.log(user);
    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left the chatroom`,
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`port connecting ${PORT}`);
});
