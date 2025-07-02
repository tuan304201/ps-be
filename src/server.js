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
import voucherRoutes from "./routes/voucher.routes.js";
import articleRoutes from "./routes/article.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import cors from "cors";

dotenv.config();

const app = express();

connectDB();
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

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
app.use("/api/voucher", voucherRoutes);
app.use("/api/article", articleRoutes);
app.use("/api/cart", cartRoutes);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Pet Shop API",
      version: "1.0.0",
      description: "API documentation for Pet Shop project",
    },
    servers: [{ url: "http://localhost:5000" }],
  },
  apis: ["./src/routes/*.js", "./src/models/*.js"],
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

server.listen(5000, () => {
  console.log("🚀 Server đang chạy trên cổng 5000");
});
