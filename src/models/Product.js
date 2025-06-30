import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    manufacturer: { type: String, required: false, default: "" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    images: [{ type: String }],
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);
export default Product;
