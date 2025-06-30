import Review from "../models/Review.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.userId;

    // Lấy thời gian hiện tại và thời gian 30 ngày trước
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    // Tìm tất cả đơn hàng hoàn tất của user với sản phẩm này, trong vòng 30 ngày
    const orders = await Order.find({
      user: userId,
      "products.product": productId,
      status: "Completed",
      createdAt: { $gte: thirtyDaysAgo }, // Chỉ xét đơn trong 30 ngày gần nhất
    });

    if (!orders.length) {
      return res.status(403).json({ message: "Bạn chưa có đơn hàng hợp lệ để đánh giá." });
    }

    // Kiểm tra xem đã có đánh giá nào trong 30 ngày gần nhất chưa
    const recentReview = await Review.findOne({
      user: userId,
      product: productId,
      createdAt: { $gte: thirtyDaysAgo }, // Chỉ xét đánh giá trong 30 ngày gần nhất
    });

    if (recentReview) {
      return res.status(403).json({ message: "Bạn đã đánh giá sản phẩm này gần đây, không thể đánh giá thêm." });
    }

    // Tạo đánh giá mới
    const review = await Review.create({
      user: userId,
      product: productId,
      rating,
      comment,
    });

    // Cập nhật rating trung bình cho sản phẩm
    const reviews = await Review.find({ product: productId });
    const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      rating: averageRating.toFixed(1),
      reviewCount: reviews.length,
    });

    res.status(201).json({ message: "Đánh giá thành công!", review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
