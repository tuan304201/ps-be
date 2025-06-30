import Address from "../models/Address.js";
import { getIO } from "../config/websocket.js";

export const addAddress = async (req, res) => {
  try {
    const { fullName, phoneNumber, street, city, state, country, isDefault } = req.body;
    const userId = req.user.userId;

    let addressDoc = await Address.findOne({ user: userId });

    if (!addressDoc) {
      addressDoc = new Address({ user: userId, addresses: [] });
    }

    if (isDefault) {
      addressDoc.addresses.forEach((addr) => (addr.isDefault = false));
    }

    addressDoc.addresses.push({
      fullName,
      phoneNumber,
      street,
      city,
      state,
      country,
      isDefault,
    });

    await addressDoc.save();
    getIO().emit("categoryCreated", { message: "Thêm địa chỉ thành công!" });
    res.json({ message: "Đã thêm địa chỉ mới", data: addressDoc });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const addressDoc = await Address.findOne({ user: userId });
    if (!addressDoc) return res.status(404).json({ message: "Không tìm thấy địa chỉ" });

    const address = addressDoc.addresses.find((addr) => addr._id.toString() === id);

    if (!address) return res.status(404).json({ message: "Không tìm thấy địa chỉ" });

    if (req.body.isDefault) {
      addressDoc.addresses.forEach((addr) => (addr.isDefault = false));
    }

    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined) {
        address[key] = req.body[key];
      }
    });

    await addressDoc.save();
    getIO().emit("categoryUpdated", { message: "Sửa địa chỉ thành công!" });
    res.json({ message: "Cập nhật địa chỉ thành công", data: addressDoc });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const addressDoc = await Address.findOne({ user: userId });
    if (!addressDoc) return res.status(404).json({ message: "Không tìm thấy địa chỉ" });

    const address = addressDoc.addresses.find((addr) => {
      return addr._id.toString() === id;
    });

    if (!address) return res.status(404).json({ message: "Không tìm thấy địa chỉ" });

    if (address.isDefault) {
      return res.status(400).json({ message: "Không thể xóa địa chỉ mặc định" });
    }

    addressDoc.addresses.pull(id);
    await addressDoc.save();
    getIO().emit("categoryDeleted", { message: "Xoá địa chỉ thành công!" });
    res.json({ message: "Xóa địa chỉ thành công", data: addressDoc });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

export const getUserAddresses = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("🚀 ~ getUserAddresses ~ userId:", userId);
    console.log("🚀 ~ getUserAddresses ~ userId:", userId);
    const addressDoc = await Address.findOne({ user: userId });

    console.log("🚀 ~ getUserAddresses ~ userId:", userId);
    if (!addressDoc) return res.json({ message: "Không có địa chỉ nào", data: [] });

    res.json({ message: "Danh sách địa chỉ", data: addressDoc.addresses });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
