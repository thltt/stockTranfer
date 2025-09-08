const express = require("express");
const cors = require("cors");
const pg = require("pg");
require("dotenv").config();
const serverless = require("serverless-http");
const webRouter = require("./src/routes/routes.js");

const app = express();

const port = process.env.HOST || 8060;

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
pg.types.setTypeParser(1082, (val) => val);

app.use("/", webRouter);

router.get("/", (req, res) => {
  res.json({ msg: "Hello từ Vercel, DB chưa bật" });
});

module.exports = serverless(app);
