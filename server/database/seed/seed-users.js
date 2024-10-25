const mongoose = require("mongoose");
const User = require("../../schemas/userSchema.js");
const bcrypt = require("bcrypt");
require("dotenv").config();

const seed = async ({ userData }) => {
    try {
        if (!mongoose.connection.readyState) {
            console.log("Connecting to database...");
            await mongoose.connect(process.env.MONGO_URI);
        }

        await mongoose.connection.dropCollection("users").catch(() => console.log("Users collection not found, skipping drop."));
        await mongoose.connection.dropCollection("events").catch(() => console.log("Events collection not found, skipping drop."));

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
    } finally {
        await mongoose.disconnect();
    }
};

module.exports = seed;
