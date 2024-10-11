const mongoose = require("mongoose");
const User = require("../db-models/userModel");

function selectAllUsers() {
  return User.find().then((result) => {
    return result;
  });
}

function selectUserById(user_id) {
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return Promise.reject({
      statusCode: 400,
      msg: "Bad Request",
    });
  }

  return User.findById(user_id).then((result) => {
    if (result === null) {
      return Promise.reject({
        statusCode: 404,
        msg: "User Not Found",
      });
    }
    return result;
  });
}

function updateUser(user_id, body) {
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return Promise.reject({
      statusCode: 400,
      msg: "Bad Request",
    });
  }

  return User.findByIdAndUpdate(user_id, body).then(() => {
    return selectUserById(user_id);
  });
}

function insertUser({ username, email, password }) {
  return User.findOne({ email }).then((existingUser) => {
    if (existingUser) {
      return Promise.reject({
        statusCode: 400,
        msg: "Sorry! That email is already taken",
      });
    } else {
      return User.create({ username, email, password }).then((result) => {
        return result;
      });
    }
  });
}

function deleteUser(user_id) {
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return Promise.reject({
      statusCode: 400,
      msg: "Bad Request",
    });
  }

  return User.findByIdAndDelete(user_id).then((result) => {
    if (result === null) {
      return Promise.reject({
        statusCode: 404,
        msg: "User Not Found",
      });
    }
    return result;
  });
}

function findUser(email, password) {
  return User.findOne({ email }).then((user) => {
    if (!user) {
      return Promise.reject({
        statusCode: 401,
        msg: "Sorry! That user doesn't exist",
      });
    }

    if (user.password !== password) {
      return Promise.reject({
        statusCode: 401,
        msg: "Sorry! That password is incorrect",
      });
    } else {
      return user;
    }
  });
}

module.exports = {
  selectAllUsers,
  selectUserById,
  updateUser,
  insertUser,
  deleteUser,
  findUser,
};
