import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    discount: { type: Number, default: 0 },
    stock: { type: Number, required: true, default: 0 },
    manufacturer: { type: String, required: false, default: "" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    images: [{ type: String }],
    mainImage: { type: String },
    hoverImage: { type: String },
    tags: [{ type: String }],
    brands: [{ type: String }],
    types: [{ type: String }],
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);
export default Product;

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         oldPrice:
 *           type: number
 *         discount:
 *           type: number
 *         stock:
 *           type: number
 *         manufacturer:
 *           type: string
 *         category:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         mainImage:
 *           type: string
 *         hoverImage:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         brands:
 *           type: array
 *           items:
 *             type: string
 *         types:
 *           type: array
 *           items:
 *             type: string
 *         rating:
 *           type: number
 *         reviewCount:
 *           type: number
 *         sold:
 *           type: number
 *         isActive:
 *           type: boolean
 */
