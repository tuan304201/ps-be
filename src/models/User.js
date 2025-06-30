import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, sparse: true },
    password: {
      type: String,
      required: true,
    },
    fullName: { type: String, default: "" },
    gender: { type: String, enum: ["male", "female", "other"], default: "other" },
    dateOfBirth: { type: Date },
    address: { type: String, default: "" },
    avatar: { type: String, default: "" },
    status: {
      type: String,
      enum: ["inactive", "active", "locked"],
      default: "inactive",
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
