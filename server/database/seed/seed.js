const mongoose = require("mongoose");
const User = require("../../db-models/userModel.js");
const Event = require("../../db-models/eventModel.js")

const seed = async ({ userData, eventData }) => {
  try {
    await mongoose.connection.dropCollection("users").catch(() => {});
    await mongoose.connection.dropCollection("events").catch(() => {});

    const users = await User.insertMany(userData);
    console.log("Success! Inserted users:", users.length);

    const userIds = users.map(user => user._id)

    const updatedEventData = eventData.map((event, index) => {
      return {
        ...event,
        createdBy: userIds[index % userIds.length]
      }
    })

    const events = await Event.insertMany(updatedEventData);
    console.log("Success! Inserted events:", events.length);

    const eventIds = events.map(event => ({
      eventId: event._id,
      userId: event.createdBy,
    }))

    const userUpdates = {};

    eventIds.forEach(({ eventId, userId }) => {
      if (!userUpdates[userId]) {
        userUpdates[userId] = [];
      }
      userUpdates[userId].push(eventId);
    });

    await Promise.all(
      Object.entries(userUpdates).map(([userId, eventIds]) =>
        User.findByIdAndUpdate(userId, {
          $push: { createdEvents: { $each: eventIds } },
        })
      )
    );

  } catch (err) {
    console.error("Database seeding error:", err);
  }
};

module.exports = seed;
