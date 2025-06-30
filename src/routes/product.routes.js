import express from "express";
import { getAllProducts, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";
const router = express.Router();

router.get("/", getAllProducts);
router.post("/", authenticate, checkRole(["superadmin", "manager"]), createProduct);
router.put("/:id", authenticate, checkRole(["superadmin", "manager"]), updateProduct);
router.delete("/:id", authenticate, checkRole(["superadmin", "manager"]), deleteProduct);

export default router;
