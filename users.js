const users = [];

const addUsers = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find((user) => {
    user.name === name && user.room === room;
  });

  if (existingUser) {
    alert("existing user");
  }

  const user = { id, name, room };
  users.push(user);
  return user;
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    let user = users.splice(index, 1)[0];
    // console.log(user);
    return user;
  } else {
    console.log("no such user");
  }
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUsers, removeUser, getUser, getUsersInRoom };
