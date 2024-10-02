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

app.get("/api/users", async (req, res, next) => {
    try {
       const users = await User.find()
       res.status(200).json({users})
    } catch (error){
        res.status(500).json({
            message: error.message,
          });
    }
})

app.get("/api/users/:id", async (req, res, next) => {
    try {
       const user = await User.findById(req.params.id)
       res.status(200).json({user})
    } catch (error){
        res.status(500).json({
            message: error.message,
          });
    }
})

app.patch("/api/users/:id", async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body)
    if(!user){
        return res.status(404).json({message: `User with ID ${req.params.id} doesn't exist`})
    }

    const updatedUser = await User.findById(req.params.id)
    res.status(200).json({
      isSuccessful: true,
      updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

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
       const user = await User.findByIdAndDelete(req.params.id)
       if(!user){
        return res.status(404).json({message: `User with ID ${req.params.id} doesn't exist`})
    }
       res.status(200).send({msg: "Deleted!"})
    } catch (error){
        res.status(500).json({
            message: error.message,
          });
    }
})

app.all('/api/*', (req, res) => {
    res.status(404).send({msg: "Page not found"})
})

module.exports = app;
