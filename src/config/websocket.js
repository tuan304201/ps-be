import { Server } from "socket.io";

let io;

export const initWebSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Hoặc cấu hình domain cụ thể
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔗 Client kết nối: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`❌ Client ngắt kết nối: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("WebSocket chưa được khởi tạo!");
  }
  return io;
};
