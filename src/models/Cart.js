import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number, default: 1 },
    mainImage: { type: String },
    selected: { type: Boolean, default: false },
  },
  { _id: false },
);

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [cartItemSchema],
    appliedVoucher: {
      code: { type: String },
      discount: { type: Number },
      type: { type: String },
      minOrder: { type: Number },
      description: { type: String },
    },
    selectedShipping: { type: String },
    selectedAddress: { type: String },
    selectedPayment: { type: String },
  },
  { timestamps: true },
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;

/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: number
 *               mainImage:
 *                 type: string
 *               selected:
 *                 type: boolean
 *         appliedVoucher:
 *           type: object
 *           properties:
 *             code:
 *               type: string
 *             discount:
 *               type: number
 *             type:
 *               type: string
 *             minOrder:
 *               type: number
 *             description:
 *               type: string
 *         selectedShipping:
 *           type: string
 *         selectedAddress:
 *           type: string
 *         selectedPayment:
 *           type: string
 */
