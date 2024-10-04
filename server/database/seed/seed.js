const User = require("../../db-models/userModel.js");
const mongoose = require("mongoose");

const seed = async ({ userData }) => {
  try {
    await mongoose.connection.dropCollection("users").catch(() => {});
    const users = await User.insertMany(userData);
    console.log("Success! Inserted users:", users.length);
  } catch (err) {
    console.error("Database seeding error:", err);
  }
};

module.exports = seed;
