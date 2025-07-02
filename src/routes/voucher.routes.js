import express from "express";
import {
  createVoucher,
  getVouchers,
  getVoucherByCode,
  updateVoucher,
  deleteVoucher,
} from "../controllers/voucher.controller.js";
import { authenticate, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Voucher
 *   description: Quản lý mã giảm giá
 */
/**
 * @swagger
 * /api/voucher:
 *   get:
 *     summary: Lấy danh sách voucher
 *     tags: [Voucher]
 *     responses:
 *       200:
 *         description: Danh sách voucher
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Voucher'
 *   post:
 *     summary: Tạo voucher mới
 *     tags: [Voucher]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Voucher'
 *     responses:
 *       201:
 *         description: Voucher đã tạo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Voucher'
 */
/**
 * @swagger
 * /api/voucher/{code}:
 *   get:
 *     summary: Lấy voucher theo code
 *     tags: [Voucher]
 *     parameters:
 *       - in: path
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Mã voucher
 *     responses:
 *       200:
 *         description: Thông tin voucher
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Voucher'
 *       404:
 *         description: Không tìm thấy voucher
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Voucher not found"
 */
/**
 * @swagger
 * /api/voucher/{id}:
 *   put:
 *     summary: Cập nhật voucher
 *     tags: [Voucher]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID voucher
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Voucher'
 *     responses:
 *       200:
 *         description: Voucher đã cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Voucher'
 *       404:
 *         description: Không tìm thấy voucher
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Voucher not found"
 *   delete:
 *     summary: Xóa voucher
 *     tags: [Voucher]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID voucher
 *     responses:
 *       200:
 *         description: Voucher đã xóa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Voucher deleted"
 *       404:
 *         description: Không tìm thấy voucher
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Voucher not found"
 */

router.post("/", authenticate, isAdmin, createVoucher);
router.get("/", getVouchers);
router.get("/:code", getVoucherByCode);
router.put("/:id", authenticate, isAdmin, updateVoucher);
router.delete("/:id", authenticate, isAdmin, deleteVoucher);

export default router;
