const express = require("express");
const app = express();
require("express-async-errors");
const cors = require("cors");
const logger = require("./utils/logger");
const config = require("./utils/config");
const mongoUrl = config.MONGODB_URI;
const mongoose = require("mongoose");
const blogsRouter = require("./controllers/blog");
const userRouter = require("./controllers/user");
const loginRouter = require("./controllers/login");
app.use(cors());
app.use(express.json());
app.use("/api/blogs", blogsRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);

mongoose
  .connect(mongoUrl)
  .then((response) => logger.info("connected to mongodb"))
  .catch((e) => logger.error(e));
module.exports = app;
