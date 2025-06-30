// 📌 Regex kiểm tra Email
export const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// 📌 Regex kiểm tra Số điện thoại
export const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^(?:\+84|0)(?:3[2-9]|5[2689]|7[0-9]|8[1-9]|9[0-9])[0-9]{7}$/;
  return phoneRegex.test(phone);
};
