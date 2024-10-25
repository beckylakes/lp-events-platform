const mongoose = require("mongoose");
const User = require("../../schemas/userSchema.js");
const bcrypt = require("bcrypt");

const seed = async ({ userData }) => {
  try {
    await mongoose.connection.dropCollection("users").catch(() => {});

    const hashedUsers = await Promise.all(
      userData.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      })
    );

    const users = await User.insertMany(hashedUsers);
    console.log("Success! Inserted users:", users.length);

  } catch (err) {
    console.error("Database seeding error:", err);
  }
};

module.exports = seed;
