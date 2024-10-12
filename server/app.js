require("dotenv").config({})
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./database/connection");
const {
  getUsers,
  getUserById,
  patchUser,
  postUser,
  deleteUserByID,
  postLogin,
} = require("./controllers/users.controllers.js");
const {
  getEvents,
  getEventById,
  patchEvent,
  postEvent,
  deleteEventByID,
  getTMEvents,
  getTMEventById
} = require("./controllers/events.controllers.js");

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res, next) => {
  return res.status(200).send({ hello: "world!" });
});

app.get("/api/users", getUsers);
app.get("/api/users/:user_id", getUserById);
app.patch("/api/users/:user_id", patchUser);
app.post("/api/users", postUser);
app.delete("/api/users/:user_id", deleteUserByID);
app.post("/api/users/login", postLogin)

app.get("/api/events", getEvents);
app.get("/api/events/:event_id", getEventById);
app.patch("/api/events/:event_id", patchEvent);
app.post("/api/events", postEvent);
app.delete("/api/events/:event_id", deleteEventByID);

app.get("/api/ticketmaster/events", getTMEvents)
app.get("/api/ticketmaster/events/:event_id", getTMEventById)

// //GET request to get pics of certain event by id
// app.get("/api/ticketmaster/events/:event_id/pics", getTMEvents)
// //GET request for search suggestions for splash page
// app.get("/api/ticketmaster/events/suggestions", getTMEvents)


app.use((err, req, res, next) => {
  if (err.statusCode && err.msg) {
    res.status(err.statusCode).send(err);
  } else {
    if (err.name === "CastError" || err.name === "ValidationError") {
      res.status(400).json({ msg: "Bad Request" });
    }
  }
});

app.all("/api/*", (req, res) => {
  res.status(404).send({ msg: `${res.statusCode}: Page Not Found` });
});

module.exports = app;
