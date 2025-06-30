import mongoose from "mongoose";

const userAdminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["superadmin", "manager", "staff"],
      default: "staff",
    },
  },
  { timestamps: true },
);

const UserAdmin = mongoose.model("UserAdmin", userAdminSchema);
export default UserAdmin;
