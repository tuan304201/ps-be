import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    icon: { type: String },
    description: { type: String },
  },
  { timestamps: true },
);

const Category = mongoose.model("Category", categorySchema);
export default Category;

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         icon:
 *           type: string
 *         description:
 *           type: string
 */
