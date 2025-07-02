import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },
    date: { type: Date, default: Date.now },
    author: { type: String },
    tags: [{ type: String }],
    status: { type: String, enum: ["draft", "published", "archived"], default: "published" },
  },
  { timestamps: true },
);

const Article = mongoose.model("Article", articleSchema);
export default Article;

/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         image:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         author:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         status:
 *           type: string
 */
