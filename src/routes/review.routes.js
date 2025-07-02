/**
 * @swagger
 * tags:
 *   name: Review
 *   description: Đánh giá sản phẩm
 */
/**
 * @swagger
 * /api/review:
 *   post:
 *     summary: Tạo đánh giá mới
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "663b1c2f8f1b2a001e8e4b1a"
 *               rating:
 *                 type: number
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Sản phẩm rất tốt!"
 *     responses:
 *       201:
 *         description: Đánh giá thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đánh giá thành công!"
 *                 review:
 *                   type: object
 *       403:
 *         description: Không đủ điều kiện đánh giá
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bạn chưa có đơn hàng hợp lệ để đánh giá."
 */
