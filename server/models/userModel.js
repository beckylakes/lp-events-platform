const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["staff", "member"], // Only allows 'staff' or 'member'
      default: "member",
    },
    eventsSignedUp: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event", // Reference to the Event model
      },
    ],
    createdEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event", // Only applies if the user is a staff member
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
