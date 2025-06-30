import mongoose from "mongoose";

const subAddress = {
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
};

const addressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    addresses: [subAddress],
  },
  { timestamps: true },
);

const Address = mongoose.model("Address", addressSchema);
export default Address;
