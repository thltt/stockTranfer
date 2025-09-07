const API = "http://localhost:8060/transfer";

window.onload = () => {
  fetchTransfer();
  document.querySelectorAll("input, select").forEach((el) => {
    el.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        addRow();
      }
    });
  });
};

//fetch transfer
async function fetchTransfer() {
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error("Server down");
    const transfers = await res.json();
    renderTable(transfers);
  } catch (err) {
    console.error("err:", err);
    alert("Lỗi");
  }
}

function formattedDate(date) {
  if (!date) {
    return "";
  } else {
    const [year, month, day] = date.slice(0, 10).split("-");
    return `${day}-${month}-${year}`;
  }
}

// hiển thị dữ liệu
function renderTable(transfers) {
  const tBody = document.getElementById("transferTable-Data");
  tBody.innerHTML = "";
  transfers.forEach((e) => {
    const row = document.createElement("tr");
    row.id = `row-${e.id}`;
    row.innerHTML = `
        <td data-value="${e.transfer_date}">${formattedDate(e.transfer_date)}</td>
        <td>${e.transferer}</td>
        <td data-value="${e.amount}">${Number(e.amount).toLocaleString("vi-VN")}</td>
        <td>${e.receiver}</td>
        <td data-value="${e.type_transfer}">${e.type_transfer}</td>
        <td data-value="${e.settlement_day}">${formattedDate(e.settlement_day)}</td>
        <td>${e.note}</td>
        <td>
          <button onclick="editTransfer(${e.id})"><i class="fa-solid fa-pen-clip"></i></button>
          <button onclick="deleteTransfer(${e.id})"><i class="fa-regular fa-trash-can"></i></button>
        </td>
    `;
    tBody.appendChild(row);
  });

  // tính tổng
  let totalTransfer = 0;
  let totalReceive = 0;
  for (let i = 0; i < transfers.length; i++) {
    if (String(transfers[i].type_transfer).toLowerCase() === "chuyển") totalTransfer += Number(transfers[i].amount);
    if (String(transfers[i].type_transfer).toLowerCase() === "nhận") totalReceive += Number(transfers[i].amount);
  }
  document.getElementById("totalTransfer").innerText = `${Number(totalTransfer).toLocaleString("vi-VN")} VNĐ`;
  document.getElementById("totalReceive").innerText = `${Number(totalReceive).toLocaleString("vi-VN")} VNĐ`;
}

//thêm giao dịch mới
async function addTransfer() {
  const transfer_date = document.getElementById("transfer_date").value;
  const transferer = document.getElementById("transferer").value || "";
  const amount = document.getElementById("amount").value;
  const receiver = document.getElementById("receiver").value || "";
  const type_transfer = document.getElementById("transferType").value;
  let settlement_day = document.getElementById("settlement_day").value;
  const note = document.getElementById("note").value || "";

  settlement_day = settlement_day === "" ? null : settlement_day;

  const transfer = {
    transfer_date,
    transferer,
    amount,
    receiver,
    type_transfer,
    settlement_day,
    note,
  };
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(transfer),
    });
    if (!res.ok) throw new Error("server down");
    fetchTransfer();
  } catch (err) {
    console.log("err", err);
    alert("Lỗi");
  }
}

//xóa giao dịch
async function deleteTransfer(id) {
  try {
    const res = await fetch(`${API}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("server down");
    fetchTransfer();
  } catch (err) {
    console.log("err", err);
    alert("Lỗi");
  }
}

// sửa giao dịch
function editTransfer(id) {
  const row = document.querySelector(`#row-${id}`);
  if (!row) return;

  const cells = row.querySelectorAll("td");
  const [c0, c1, c2, c3, c4, c5, c6] = cells;

  // Lấy data-* nếu có, nếu không dùng text
  const get = (td, key = "value") => td?.dataset?.[key] ?? td?.getAttribute(`data-${key}`) ?? td?.textContent?.trim() ?? "";

  // Chuẩn hóa ngày về YYYY-MM-DD cho <input type="date">
  const toInputDate = (s) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s; // đã đúng format
    const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); // dd/mm/yyyy
    return m ? `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}` : "";
  };

  const transfer_date = toInputDate(c0.dataset.value);
  const transferer = c1.textContent.trim();
  const amount = c2.dataset.value;
  const receiver = c3.textContent.trim();
  const type_transfer = get(c4) || c4.textContent.trim(); // 'Chuyển' | 'Nhận'
  const settlement_day = toInputDate(c5.dataset.value);
  const note = c6.textContent.trim();

  row.innerHTML = `
    <td><input id="edit_transfer_date_${id}" type="date" value="${transfer_date}" /></td>
    <td><input id="edit_transferer_${id}" type="text" value="${transferer}" /></td>
    <td><input id="edit_amount_${id}" type="number" step="10000" min="0" value="${amount}" /></td>
    <td><input id="edit_receiver_${id}" type="text" value="${receiver}" /></td>
    <td>
      <select id="edit_transferType_${id}">
        <option value="" disabled>--Chọn loại--</option>
        <option value="Chuyển" ${type_transfer === "Chuyển" ? "selected" : ""}>Chuyển</option>
        <option value="Nhận"   ${type_transfer === "Nhận" ? "selected" : ""}>Nhận</option>
      </select>
    </td>
    <td><input id="edit_settlement_day_${id}" type="date" value="${settlement_day}" /></td>
    <td><input id="edit_note_${id}" type="text" value="${note || ""}" /></td>
    <td>
      <button onclick="updateTransfer(${id})"><i class="fa-solid fa-square-check"></i></button>
      <button onclick="fetchTransfer()"><i class="fa-solid fa-circle-xmark"></i></button>
    </td>
  `;
}

// xác nhận cập nhật
async function updateTransfer(id) {
  const transfer_date = document.getElementById(`edit_transfer_date_${id}`).value;
  const transferer = document.getElementById(`edit_transferer_${id}`).value;
  const amount = document.getElementById(`edit_amount_${id}`).value;
  const receiver = document.getElementById(`edit_receiver_${id}`).value;
  const type_transfer = document.getElementById(`edit_transferType_${id}`).value;
  const settlement_day = document.getElementById(`edit_settlement_day_${id}`).value || null;
  const note = document.getElementById(`edit_note_${id}`).value || "";

  const transfer = { transfer_date, transferer, amount, receiver, type_transfer, settlement_day, note };

  try {
    const res = await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transfer),
    });
    if (!res.ok) throw new Error("server down");
    fetchTransfer();
  } catch (err) {
    console.error("err", err);
    alert("Lỗi");
  }
}

//reset input
function resetInput() {
  document.querySelectorAll("input, select").forEach((el) => (el.value = ""));
}

//xuất excel
function exportExcel() {
  const today = new Date();
  const todayString = today.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const table = document.getElementById("transferTable");
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.table_to_sheet(table, { raw: true });

  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, `GiaoDich_${todayString}.xlsx`);
}
