const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./database/connection");
const User = require("./models/userModel");
const Event = require("./models/eventModel");

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res, next) => {
  return res.status(200).send({ hello: "world!" });
});

module.exports = app;
