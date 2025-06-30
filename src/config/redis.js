import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
});

redisClient.on("connect", () => console.log("🔗 Kết nối Redis thành công!"));
redisClient.on("error", (err) => console.error("❌ Redis lỗi:", err));

export default redisClient;
