const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        option: { type: String },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    services: [
      {
        service: { type: mongoose.Schema.Types.ObjectId, ref: "PetService", required: true },
        weight: { type: String },
        furType: { type: String, enum: ["Ngắn", "Dài"] },
        date: { type: Date },
        quantity: { type: Number, default: 1 },
      },
    ],
    address: {
      name: { type: String },
      phone: { type: String },
      address: { type: String },
    },
    shipping: {
      id: { type: String },
      name: { type: String },
      price: { type: Number },
      time: { type: String },
    },
    payment: {
      id: { type: String },
      name: { type: String },
      description: { type: String },
      icon: { type: String },
      iconColor: { type: String },
      badge: { type: String },
    },
    voucher: {
      code: { type: String },
      discount: { type: Number },
      type: { type: String },
      minOrder: { type: Number },
      description: { type: String },
    },
    shippingFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    status: { type: String, enum: ["Pending", "Confirmed", "Shipping", "Completed", "Cancelled"], default: "Pending" },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
