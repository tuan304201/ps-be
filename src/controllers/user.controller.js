import User from "../models/User.js";

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { fullName, gender, dateOfBirth, address, avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, gender, dateOfBirth, address, avatar },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.status(200).json({ message: "Cập nhật thông tin thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
