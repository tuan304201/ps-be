const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "PetService", required: true },
    weight: { type: String, required: true },
    furType: { type: String, enum: ["Ngắn", "Dài"], required: true },
    date: { type: Date, required: true },
    quantity: { type: Number, default: 1 },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Confirmed", "Cancelled"], default: "Pending" },
  },
  { timestamps: true },
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
