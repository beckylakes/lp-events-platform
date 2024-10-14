require("dotenv").config();
const {
  selectEventById,
  findTMEventById,
} = require("../models/events.models.js");
const {
  selectAllUsers,
  selectUserById,
  updateUser,
  insertUser,
  deleteUser,
  findUser,
} = require("../models/users.models.js");

const API_KEY = process.env.API_KEY;

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

function postAttendEvent(req, res, next) {
  const { user_id } = req.params;
  const { eventId } = req.body;
  return selectUserById(user_id)
    .then((user) => {
      return selectEventById(eventId)
        .then((event) => {
          if (!event.attendees.includes(user_id)) {
            event.attendees.push(user_id);
            return event.save();
          }
        })
        .then(() => {
          if (!user.attendingEvents.includes(eventId)) {
            user.attendingEvents.push(eventId);
            return user.save().then((updatedUser) => {
              res.status(201).send({
                msg: "You're going to this event!",
                user: updatedUser,
              });
            });
          } else {
            res
              .status(400)
              .send({ msg: "You're already attending this event!", user });
          }
        });
    })
    .catch((err) => {
      next(err);
    });
}

function postAttendTMEvent(req, res, next) {
  const { user_id } = req.params;
  const { eventId } = req.body;

  let user;

  return selectUserById(user_id)
    .then((foundUser) => {
      user = foundUser;
    })
    .then(() => {
      return fetch(`https://app.ticketmaster.com/discovery/v2/events/${eventId}.json?apikey=${API_KEY}`)
    })
    .then((response) => response.json())
    .then((tmEvent) => {
      return findTMEventById({ ticketmasterId: eventId }, tmEvent);
    })
    .then((event) => {
      if (!event.attendees.includes(user._id)) {
        event.attendees.push(user._id);
        return event.save().then(() => event);
      }
      return event;
    })
    .then((event) => {
      if (!user.attendingEvents.includes(event._id)) {
        user.attendingEvents.push(event._id);
        return user.save().then((updatedUser) => {
          res.status(201).send({
            msg: "You're going to this event!",
            user: updatedUser,
          });
        });
      } else {
        res
          .status(400)
          .send({ msg: "You're already attending this event!", user });
      }
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
  postAttendEvent,
  postAttendTMEvent,
};
