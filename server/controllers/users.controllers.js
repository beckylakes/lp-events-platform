require("dotenv").config();
const {
  selectEventById,
  insertEvent,
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
              .status(200)
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

  // Will need to check logic below here, as we dont need to create an event here anymore - by the time this func is invoked, the event already exists in MongoDB.

  return selectUserById(user_id)
    .then((foundUser) => {
      user = foundUser;
// FindOne using evenId on ticketmasterId object {ticketmasterId : eventId}
// from what's returned we want to return selectEventById(returnedevent._id);
      return fetch(
        `https://app.ticketmaster.com/discovery/v2/events/${eventId}.json?apikey=${API_KEY}`
      )
        .then((response) => {
          return response.json();
        })
        .then((event) => {
          const newEvent = {
            name: event.name,
            info: event.info || "No info available",
            location: event._embedded?.venues[0]?.name || "Unknown",
            date: event.dates.start.localDate || null,
            startTime: event.dates.start.localTime || null,
            endTime: event.dates.end?.localTime || null,
            createdBy: null,
            price: event.priceRanges?.[0]?.min || 0,
            attendees: [],
            isPaid: event.priceRanges?.[0]?.min > 0 || false,
            tags:
              event.classifications?.map(
                (classification) => classification.segment.name
              ) || [],
            images: event.images?.map((img) => img.url) || [],
            isExternal: true,
            ticketmasterId: eventId,
            url: event.url,
          };

          return insertEvent(newEvent).then((createdEvent) => {
            return selectEventById(createdEvent._id);
          });
        });
    })
    //Up to here should be changed I think!!
    .then((uniqueEvent) => {
      if (!uniqueEvent.attendees.includes(user._id)) {
        uniqueEvent.attendees.push(user._id);
        return uniqueEvent.save().then(() => uniqueEvent);
      }
      return uniqueEvent;
    })
    .then((uniqueEvent) => {
      if (!user.attendingEvents.includes(uniqueEvent._id)) {
        console.log("should be here 2");
        user.attendingEvents.push(uniqueEvent._id);

        return user.save().then((updatedUser) => {
          res.status(201).send({
            msg: "You're going to this event!",
            user: updatedUser,
          });
        });
      } else {
        res
          .status(200)
          .send({ msg: "You're already attending this event!", user });
      }
    })
    .catch((err) => {
      console.error("An error occurred:", err);
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
