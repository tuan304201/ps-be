import mongoose from "mongoose";

const userAdminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    avatar: { type: String },
    role: {
      type: String,
      enum: ["superadmin", "manager", "staff", "admin", "editor", "viewer"],
      default: "staff",
    },
  },
  { timestamps: true },
);

const UserAdmin = mongoose.model("UserAdmin", userAdminSchema);
export default UserAdmin;
