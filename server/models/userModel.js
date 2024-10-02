const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, enum: ["staff", "non-staff"], default: "non-staff" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
