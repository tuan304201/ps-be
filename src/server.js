import express from "express";
import http from "http";
import dotenv from "dotenv";
import { initWebSocket } from "./config/websocket.js";
import authRoutes from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import authAdminRoutes from "./routes/auth-admin.routes.js";
import userAdminRoutes from "./routes/list-user.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
import addressRoutes from "./routes/address.routes.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

connectDB();
app.use(cookieParser());

const server = http.createServer(app);
initWebSocket(server);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/auth-admin", authAdminRoutes);
app.use("/api/user", userRouter);
app.use("/api/admin/user", userAdminRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/address", addressRoutes);

server.listen(5000, () => {
  console.log("🚀 Server đang chạy trên cổng 5000");
});
