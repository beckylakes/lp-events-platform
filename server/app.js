require("dotenv").config({});
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./database/connection");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const ROLES_LIST = require("./config/roles-list.js");
const verifyRoles = require("./middleware/verifyRoles.js");
const {
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
  postUnattend
} = require("./controllers/users.controllers.js");
const {
  getEvents,
  getEventById,
  patchEvent,
  postEvent,
  deleteEventByID,
  getTMEvents,
  getTMEventById,
} = require("./controllers/events.controllers.js");

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

connectDB();

app.post("/api/users/login", postLogin);
app.post("/api/users", postUser); 
app.post("/api/users/refresh", postRefreshToken);
app.post("/api/users/logout", postLogout);

app.get("/api/users", getUsers); 
app.get("/api/users/:user_id", getUserById); 
app.get("/api/events", getEvents); 
app.get("/api/ticketmaster/events", getTMEvents); 
app.get("/api/events/:event_id", getEventById); 
app.get("/api/ticketmaster/events/:event_id", getTMEventById); 

app.patch("/api/users/:user_id", verifyJWT, verifyRoles(ROLES_LIST.Organiser, ROLES_LIST.User), patchUser); 
app.post("/api/users/:user_id/attend", verifyJWT, verifyRoles(ROLES_LIST.Organiser, ROLES_LIST.User), postAttendEvent) 
app.post("/api/users/:user_id/ticketmaster/attend", verifyJWT, verifyRoles(ROLES_LIST.Organiser, ROLES_LIST.User), postAttendTMEvent) 
app.post("/api/users/:user_id/unattend", verifyJWT, verifyRoles(ROLES_LIST.Organiser, ROLES_LIST.User), postUnattend)
app.delete("/api/users/:user_id", verifyJWT, verifyRoles(ROLES_LIST.Organiser, ROLES_LIST.User), deleteUserByID); 

app.patch("/api/events/:event_id", verifyJWT, verifyRoles(ROLES_LIST.Organiser), patchEvent); 
app.post("/api/events", verifyJWT, verifyRoles(ROLES_LIST.Organiser), postEvent); 
app.delete("/api/events/:event_id", verifyJWT, verifyRoles(ROLES_LIST.Organiser), deleteEventByID); 

app.use((err, req, res, next) => {
  if (err.statusCode && err.msg) {
    res.status(err.statusCode).send(err);
  } else {
    if (err.name === "CastError" || err.name === "ValidationError") {
      res.status(400).json({ msg: "Bad request" });
    }
  }
});

app.all("/api/*", (req, res) => {
  res.status(404).send({ msg: `${res.statusCode}: Page not found` });
});

module.exports = app;
