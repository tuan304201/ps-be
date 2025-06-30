import express from "express";
import { getUserAddresses, deleteAddress, updateAddress, addAddress } from "../controllers/address.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/", authenticate, getUserAddresses);
router.post("/", authenticate, addAddress);
router.put("/:id", authenticate, updateAddress);
router.delete("/:id", authenticate, deleteAddress);

export default router;
