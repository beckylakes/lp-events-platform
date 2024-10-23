const {
  selectEventById,
  findTMEventById,
  findEventByUser
} = require("../models/events.models.js");
const {
  selectAllUsers,
  selectUserById,
  updateUser,
  insertUser,
  deleteUser,
  findUser,
  findUserByRefreshToken,
} = require("../models/users.models.js");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../schemas/userSchema.js");

const API_KEY = process.env.API_KEY;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN_SECRET;

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
    return res.status(400).send({ msg: "Bad request" });
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
      const roles = Object.values(user.roles).filter(Boolean);

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: user.username,
            roles: user.roles,
          },
        },
        ACCESS_TOKEN,
        {
          expiresIn: "15m",
        }
      );
      const refreshToken = jwt.sign(
        { username: user.username },
        REFRESH_TOKEN,
        {
          expiresIn: "1d",
        }
      );

      user.refreshToken = refreshToken;
      return user.save().then(() => {
        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          sameSite: "None",
          secure: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
        res
          .status(200)
          .send({ accessToken, roles, user, msg: "Logged in successfully" });
      });
    })
    .catch((err) => {
      next(err);
    });
}

//Can't test for this as only browser supports cookies
function postLogout(req, res, next) {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(204);

  const refreshToken = cookies.jwt;

  return findUserByRefreshToken({ refreshToken })
    .then((user) => {
      if (!user) {
        res.clearCookie("jwt", {
          httpOnly: true,
          sameSite: "None",
          secure: true,
        });
        return res.sendStatus(204);
      }

      user.refreshToken = "";
      return user.save().then(() => {
        res.clearCookie("jwt", {
          httpOnly: true,
          sameSite: "None",
          secure: true,
        });
        res.status(204).send({ msg: "Successfully logged out" });
      });
    })
    .catch((err) => next(err));
}

//Can't test for cookies in supertest?
async function postRefreshToken(req, res, next) {
  const cookies = req.cookies;
  if (!cookies?.jwt)
    return res.status(401).send({ msg: "Unauthorized access" });

  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403); //Forbidden
  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403);
    const roles = Object.values(foundUser.roles).filter(Boolean);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: decoded.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10s" }
    );
    res.json({
      roles,
      accessToken,
      username: foundUser.username,
      avatar: foundUser.avatar,
      _id: foundUser._id,
    });
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
                msg: "You're going to this event",
                user: updatedUser,
              });
            });
          } else {
            res
              .status(400)
              .send({ msg: "You're already attending this event", user });
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
      return fetch(
        `https://app.ticketmaster.com/discovery/v2/events/${eventId}.json?apikey=${API_KEY}`
      );
    })
    .then((response) => response.json())
    .then((tmEvent) => {
      console.log(tmEvent)
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
            msg: "You're going to this event",
            user: updatedUser,
          });
        });
      } else {
        res
          .status(400)
          .send({ msg: "You're already attending this event", user });
      }
    })
    .catch((err) => {
      next(err);
    });
}
// Write tests for
function getUserEvents(req, res, next) {
  const {user_id} = req.params
  return findEventByUser(user_id).then((events) => {
    res.status(200).send(events)
  }).catch((err) => next(err))
}

module.exports = {
  getUsers,
  getUserById,
  patchUser,
  postUser,
  deleteUserByID,
  postLogin,
  postLogout,
  postRefreshToken,
  postAttendEvent,
  postAttendTMEvent,
  getUserEvents
};
