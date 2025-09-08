require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.RAIL_DB_HOST,
  port: process.env.RAIL_DB_PORT,
  user: process.env.RAIL_DB_USER,
  password: process.env.RAIL_DB_PASSWORD,
  database: process.env.RAIL_DB_DBNAME,
  max: 10, // số connection tối đa
  idleTimeoutMillis: 60000,
  keepAlive: true,
});

// Kiểm tra kết nối DB
(async () => {
  try {
    const connection = await pool.connect();
    console.log("✅ Kết nối Postgres thành công");
    connection.release();
  } catch (err) {
    console.error("❌ Lỗi kết nối DB:", err);
    process.exit(1);
  }
})();

module.exports = pool;
