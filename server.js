const express = require("express");
const cors = require("cors");
const pg = require("pg");
require("dotenv").config();
const webRouter = require("./src/routes/routes.js");

const app = express();

const port = process.env.HOST || 8060;
const hostname = process.env.HOSTNAME || "localhost";

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
pg.types.setTypeParser(1082, (val) => val); // 1082 = OID của DATE, trả về string luôn

app.use("/", webRouter);

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "index.html"));
// });

app.listen(port, hostname, () => {
  console.log(`server đang chạy tại port: ${port}`);
});
