const pool = require("../config/database.js");

//select toàn bộ dữ liệu trong bảng
const getTransfer = async (req, res) => {
  const rows = await pool.query(`SELECT * FROM transfer ORDER BY transfer_date DESC, id DESC`);
  return rows;
};

// thêm giao dịch
const addNewTransfer = async ({ transfer_date, transferer, amount, receiver, type_transfer, settlement_day, note }) => {
  const transfer = await pool.query(
    `INSERT INTO transfer (transfer_date, transferer, amount, receiver, type_transfer, settlement_day, note)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING id`,
    [transfer_date, transferer, amount, receiver, type_transfer, settlement_day, note]
  );
  return transfer.rows[0].id;
};

// xóa giao dịch
const deleteTransferById = async (id) => {
  const result = await pool.query(`DELETE FROM transfer WHERE id = $1 RETURNING *`, [id]);
  return result.rowCount;
};

// chỉnh sửa giao dịch
const updateTransfer = async (id, transfer_date, transferer, amount, receiver, type_transfer, settlement_day, note) => {
  const result = await pool.query(
    `UPDATE transfer
     SET transfer_date = $2 ,transferer = $3, amount = $4, receiver = $5, type_transfer = $6 ,settlement_day = $7, note = $8 WHERE id=$1 RETURNING *`,
    [id, transfer_date, transferer, amount, receiver, type_transfer, settlement_day, note]
  );
  return result.rows;
};

module.exports = {
  getTransfer,
  addNewTransfer,
  deleteTransferById,
  updateTransfer,
};
