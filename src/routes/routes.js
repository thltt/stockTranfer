const express = require("express");
const router = express.Router();
const { getTranfers, postTranfer, removeTransferById, editTransfer } = require("../controllers/homeController.js");

//homepage
router.get("/", (req, res) => {
  res.send("Transfer backend");
});

// lấy toàn bộ giao dịch
router.get("/transfer", getTranfers);

// thêm giao dịch
router.post("/transfer", postTranfer);

// xóa giao dịch
router.delete("/transfer/:id", removeTransferById);

// sửa giao dịch
router.put("/transfer/:id", editTransfer);

module.exports = router;
