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

app.get("/users", async (req, res, next) => {
    try {
       const users = await User.find()
       res.status(200).json({users})
    } catch (error){
        res.status(500).json({
            message: error.message,
          });
    }
})

app.post("/users", async (req, res, next) => {
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

module.exports = app;
