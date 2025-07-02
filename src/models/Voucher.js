import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true },
    type: { type: String, enum: ["percentage", "fixed_shipping", "fixed_amount"], required: true },
    minOrder: { type: Number, default: 0 },
    description: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    quantity: { type: Number, default: 0 },
    used: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Voucher = mongoose.model("Voucher", voucherSchema);
export default Voucher;

/**
 * @swagger
 * components:
 *   schemas:
 *     Voucher:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         discount:
 *           type: number
 *         type:
 *           type: string
 *         minOrder:
 *           type: number
 *         description:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         quantity:
 *           type: number
 *         used:
 *           type: number
 *         isActive:
 *           type: boolean
 */
