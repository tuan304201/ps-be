const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        option: { type: String, required: false },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    services: [
      {
        service: { type: mongoose.Schema.Types.ObjectId, ref: "PetService", required: true },
        weight: { type: String, required: true },
        furType: { type: String, enum: ["Ngắn", "Dài"], required: true },
        date: { type: Date, required: true },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    status: { type: String, enum: ["Pending", "Completed", "Cancelled"], default: "Pending" },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
