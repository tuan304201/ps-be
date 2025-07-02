const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    petName: { type: String },
    serviceName: { type: String },
    price: { type: Number },
    date: { type: Date },
    status: { type: String, enum: ["Pending", "Confirmed", "Completed", "Cancelled"], default: "Pending" },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "PetService", required: true },
    weight: { type: String, required: true },
    furType: { type: String, enum: ["Ngắn", "Dài"], required: true },
    quantity: { type: Number, default: 1 },
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true },
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
