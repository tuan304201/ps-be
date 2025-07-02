import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { deleteAdmin, getAllAdmins, updateAdmin } from "../controllers/userAdmin.controller.js";
import { checkRole } from "../middlewares/role.middleware.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: AdminUser
 *   description: Quản lý người dùng (admin)
 */
/**
 * @swagger
 * /api/admin/user:
 *   get:
 *     summary: Lấy danh sách user
 *     tags: [AdminUser]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách user
 */
router.get("/", authenticate, checkRole(["superadmin", "manager"]), getAllAdmins);
router.put("/:id", authenticate, checkRole(["superadmin", "manager"]), updateAdmin);
router.delete("/:id", authenticate, checkRole(["superadmin", "manager"]), deleteAdmin);

export default router;
