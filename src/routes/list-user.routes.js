import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { deleteAdmin, getAllAdmins, updateAdmin } from "../controllers/userAdmin.controller.js";
import { checkRole } from "../middlewares/role.middleware.js";
const router = express.Router();

router.get("/", authenticate, checkRole(["superadmin", "manager"]), getAllAdmins);
router.put("/:id", authenticate, checkRole(["superadmin", "manager"]), updateAdmin);
router.delete("/:id", authenticate, checkRole(["superadmin", "manager"]), deleteAdmin);

export default router;
