import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Người đánh giá
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // Sản phẩm được đánh giá
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true }, // Đơn hàng liên quan
    rating: { type: Number, required: true, min: 1, max: 5 }, // Số sao (1 - 5)
    comment: { type: String, required: true }, // Nội dung đánh giá
  },
  { timestamps: true }, // Tự động thêm createdAt & updatedAt
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
