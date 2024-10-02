const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      default: "https://t4.ftcdn.net/jpg/05/49/98/39/240_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["staff", "member"],
      default: "member",
    },
    attendingEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    createdEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
