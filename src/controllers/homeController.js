const { getTransfer, addNewTransfer, deleteTransferById, updateTransfer } = require("../services/CRUD.js");

// lấy dữ liệu
const getTranfers = async (req, res) => {
  try {
    const results = await getTransfer();
    res.json(results.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu" });
  }
};

// thêm giao dịch
const postTranfer = async (req, res) => {
  try {
    const transfer = await addNewTransfer(req.body);
    res.json({ id: transfer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi thêm giao dịch" });
  }
};

// xóa giao dịch
const removeTransferById = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteCount = await deleteTransferById(id);
    res.json({ success: true, deleted: deleteCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi xóa giao dịch" });
  }
};

// chỉnh sửa giao dịch
const editTransfer = async (req, res) => {
  try {
    const id = req.params.id;
    const { transfer_date, transferer, amount, receiver, type_transfer, settlement_day, note } = req.body;
    const edited = await updateTransfer(id, transfer_date, transferer, amount, receiver, type_transfer, settlement_day, note);
    res.json({ success: true, data: edited[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi chỉnh sửa giao dịch" });
  }
};

module.exports = {
  getTranfers,
  postTranfer,
  removeTransferById,
  editTransfer,
};
