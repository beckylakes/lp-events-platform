const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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

async function insertUser({ username, email, password }) {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return Promise.reject({
      statusCode: 400,
      msg: "Sorry! That email is already taken",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  return newUser;
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

async function findUser(email, password) {
  const user = await User.findOne({ email });
  
  if (!user) {
    return Promise.reject({
      statusCode: 401,
      msg: "Sorry! That user doesn't exist",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return Promise.reject({
      statusCode: 401,
      msg: "Sorry! That password is incorrect",
    });
  }

  return user;
}

module.exports = {
  selectAllUsers,
  selectUserById,
  updateUser,
  insertUser,
  deleteUser,
  findUser,
};
