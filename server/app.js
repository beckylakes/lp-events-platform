const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./database/connection");
const User = require("./db-models/userModel");
const Event = require("./db-models/eventModel");

const { getUsers, getUserById, patchUser, postUser, deleteUserByID } = require("./controllers/users.controllers.js");

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res, next) => {
  return res.status(200).send({ hello: "world!" });
});

app.get("/api/users", getUsers);
app.get("/api/users/:user_id", getUserById);
app.patch("/api/users/:user_id", patchUser);
app.post("/api/users", postUser)
app.delete("/api/users/:user_id", deleteUserByID)

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
