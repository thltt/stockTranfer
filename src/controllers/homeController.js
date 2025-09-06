const { put } = require("../routes/routes.js");
const { getTransfer, addNewTransfer, deleteTransferById, updateTransfer } = require("../services/CRUD.js");

// lấy dữ liệu
const getTranfers = async (req, res) => {
  const results = await getTransfer();
  res.json(results.rows);
};

// thêm giao dịch
const postTranfer = async (req, res) => {
  const transfer = await addNewTransfer(req.body);
  res.json({ id: transfer });
};

// xóa giao dịch
const removeTransferById = async (req, res) => {
  const id = req.params.id;
  const deleteCount = await deleteTransferById(id);
  res.json({ succes: true, deleted: deleteCount });
};

// chỉnh sửa giao dịch
const editTransfer = async (req, res) => {
  const id = req.params.id;
  const { transfer_date, transferer, amount, receiver, type_transfer, settlement_day, note } = req.body;
  const edited = await updateTransfer(id, transfer_date, transferer, amount, receiver, type_transfer, settlement_day, note);
  res.json({ success: true, data: edited[0] });
};

module.exports = {
  getTranfers,
  postTranfer,
  removeTransferById,
  editTransfer,
};
