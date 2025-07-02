import Voucher from "../models/Voucher.js";

export const createVoucher = async (req, res) => {
  try {
    const voucher = new Voucher(req.body);
    await voucher.save();
    res.status(201).json(voucher);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find({ isActive: true });
    res.json(vouchers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getVoucherByCode = async (req, res) => {
  try {
    const voucher = await Voucher.findOne({ code: req.params.code, isActive: true });
    if (!voucher) return res.status(404).json({ error: "Voucher not found" });
    res.json(voucher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!voucher) return res.status(404).json({ error: "Voucher not found" });
    res.json(voucher);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.findByIdAndDelete(req.params.id);
    if (!voucher) return res.status(404).json({ error: "Voucher not found" });
    res.json({ message: "Voucher deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
