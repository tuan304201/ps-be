import express from "express";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";
const router = express.Router();

router.get("/", getAllCategories);
router.post("/", authenticate, checkRole(["superadmin", "manager"]), createCategory);
router.put("/:id", authenticate, checkRole(["superadmin", "manager"]), updateCategory);
router.delete("/:id", authenticate, checkRole(["superadmin", "manager"]), deleteCategory);

export default router;
