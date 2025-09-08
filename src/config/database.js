require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.RAIL_DB_HOST,
  port: process.env.RAIL_DB_PORT,
  user: process.env.RAIL_DB_USER,
  password: process.env.RAIL_DB_PASSWORD,
  database: process.env.RAIL_DB_DBNAME,
  waitForConnections: true,
  maxIdle: 10,
  idleTimeoutMillis: 60000,
  keepAlive: true,
  keepAliveInitialDelay: 0,
});

// check kết nối db
(async () => {
  try {
    const connection = await pool.connect();
    console.log("✅ Kết nối postgresDB ok");
    connection.release();
  } catch (err) {
    console.error("❌ Lỗi DB mẹ nó rồi", err);
    process.exit(1);
  }
})();

module.exports = pool;
