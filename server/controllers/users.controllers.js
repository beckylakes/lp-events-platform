const { selectAllUsers, selectUserById } = require("../models/users.models.js");

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
  const { id } = req.params;
  return selectUserById(id).then((user) => {
    res.status(200).send({user})
  }).catch((err) => {
    next(err)
  })
}

module.exports = { getUsers, getUserById };
