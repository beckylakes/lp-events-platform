const {
  selectAllUsers,
  selectUserById,
  updateUser,
  insertUser,
  deleteUser,
  findUser,
} = require("../models/users.models.js");

function getUsers(req, res, next) {
  return selectAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
}

function getUserById(req, res, next) {
  const { user_id } = req.params;
  return selectUserById(user_id)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
}

function patchUser(req, res, next) {
  const { user_id } = req.params;
  const newBody = req.body;
  return updateUser(user_id, newBody)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
}

function postUser(req, res, next) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).send({ msg: "Bad Request" });
  }

  return insertUser({ username, email, password })
    .then((user) => {
      res.status(201).send({ msg: "New user created", user });
    })
    .catch((err) => {
      next(err);
    });
}

function deleteUserByID(req, res, next) {
  const { user_id } = req.params;
  return deleteUser(user_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
}

function postLogin(req, res, next) {
  const { email, password } = req.body;
  return findUser(email, password)
    .then((user) => {
      res.status(200).send({ msg: "Logged in successfully", user });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getUsers,
  getUserById,
  patchUser,
  postUser,
  deleteUserByID,
  postLogin,
};
