const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./database/connection");
const User = require("./db-models/userModel");
const Event = require("./db-models/eventModel");

const { getUsers, getUserById, patchUser } = require("./controllers/users.controllers.js");

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res, next) => {
  return res.status(200).send({ hello: "world!" });
});

app.get("/api/users", getUsers);
app.get("/api/users/:user_id", getUserById);
app.patch("/api/users/:user_id", patchUser);

app.post("/api/users", async (req, res, next) => {
  //   console.log(req.body);
  try {
    const user = await User.create(req.body);
    res.status(200).json({
      isSuccessful: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.delete("/api/users/:id", async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with ID ${req.params.id} doesn't exist` });
    }
    res.status(200).send({ msg: "Deleted!" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.use((err, req, res, next) => {
  if (err.statusCode && err.msg) {
    res.status(err.statusCode).send(err);
  } else {
    if (err.name === "CastError") {
      res.status(400).json({ msg: "Bad Request" });
    }
  }
});

app.all("/api/*", (req, res) => {
  res.status(404).send({ msg: `${res.statusCode}: Page Not Found` });
});

module.exports = app;
