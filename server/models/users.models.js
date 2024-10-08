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

function insertUser(new_user) {
  return User.create(new_user).then((result) => {
    return result;
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

module.exports = {
  selectAllUsers,
  selectUserById,
  updateUser,
  insertUser,
  deleteUser,
};
