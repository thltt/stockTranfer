const { getTransfer, addNewTransfer, deleteTransferById, updateTransfer } = require("../services/CRUD.js");

// Lấy dữ liệu
const getTranfers = async (req, res) => {
  try {
    const results = await getTransfer();
    res.json(results.rows);
  } catch (err) {
    console.error("❌ Lỗi getTransfers:", err);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu" });
  }
};

// Thêm giao dịch
const postTranfer = async (req, res) => {
  try {
    const transferId = await addNewTransfer(req.body);
    res.json({ id: transferId });
  } catch (err) {
    console.error("❌ Lỗi postTransfer:", err);
    res.status(500).json({ error: "Lỗi khi thêm giao dịch" });
  }
};

// Xóa giao dịch
const removeTransferById = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteCount = await deleteTransferById(id);
    res.json({ success: true, deleted: deleteCount });
  } catch (err) {
    console.error("❌ Lỗi removeTransferById:", err);
    res.status(500).json({ error: "Lỗi khi xóa giao dịch" });
  }
};

// Sửa giao dịch
const editTransfer = async (req, res) => {
  try {
    const id = req.params.id;
    const { transfer_date, transferer, amount, receiver, type_transfer, settlement_day, note } = req.body;
    const edited = await updateTransfer(id, transfer_date, transferer, amount, receiver, type_transfer, settlement_day, note);
    res.json({ success: true, data: edited[0] });
  } catch (err) {
    console.error("❌ Lỗi editTransfer:", err);
    res.status(500).json({ error: "Lỗi khi chỉnh sửa giao dịch" });
  }
};

module.exports = {
  getTranfers,
  postTranfer,
  removeTransferById,
  editTransfer,
};
