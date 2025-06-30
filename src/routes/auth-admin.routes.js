import express from "express";
import { loginAdmin, registerAdmin, logoutAdmin } from "../controllers/authAdmin.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout", authenticate, logoutAdmin);

export default router;
