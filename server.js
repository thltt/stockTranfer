const express = require("express");
const cors = require("cors");
const pg = require("pg");
require("dotenv").config();
const webRouter = require("./src/routes/routes.js");

const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
pg.types.setTypeParser(1082, (val) => val);

app.use("/", webRouter);

module.exports = app;
