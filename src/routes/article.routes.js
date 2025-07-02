import express from "express";
import {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} from "../controllers/article.controller.js";
import { authenticate, isEditor } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, isEditor, createArticle);
router.get("/", getArticles);
router.get("/:id", getArticleById);
router.put("/:id", authenticate, isEditor, updateArticle);
router.delete("/:id", authenticate, isEditor, deleteArticle);

export default router;
