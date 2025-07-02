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
    name: { type: String, required: true },
    phone: { type: String },
    dob: { type: Date },
    addresses: [
      {
        name: { type: String },
        phone: { type: String },
        address: { type: String },
        default: { type: Boolean, default: false },
      },
    ],
    notifications: [
      {
        icon: { type: String },
        message: { type: String },
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         phone:
 *           type: string
 *         dob:
 *           type: string
 *           format: date
 *         gender:
 *           type: string
 *         avatar:
 *           type: string
 *         addresses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Address'
 *         notifications:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               icon:
 *                 type: string
 *               message:
 *                 type: string
 *               read:
 *                 type: boolean
 *               createdAt:
 *                 type: string
 *                 format: date-time
 */
