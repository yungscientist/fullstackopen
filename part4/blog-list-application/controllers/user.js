const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");
const logger = require("../utils/logger");
const mongoose = require("mongoose");
const { response } = require("../app");
const { status } = require("express/lib/response");
const app = require("../app");
const bcrypt = require("bcrypt");
const saltRounds = 10;
userRouter.post("/", async (request, response) => {
  const { name, username, password } = request.body;
  const existingUser = await User.findOne({ username });
  if (username == undefined || password == undefined) {
    return response.status(400).json({
      error: "both username and password must be given",
    });
  }

  if ((username.length || password.length) < 3) {
    return response.status(400).json({
      error: "username and password must be at least 3 characters long",
    });
  }

  if (existingUser) {
    return response.status(400).json({
      error: "username must be unique",
    });
  }
  logger.info(request.body);

  const passwordHash = await bcrypt.hash(password, saltRounds);
  console.log(passwordHash);
  const user = new User({
    name,
    username,
    passwordHash,
  });
  const savedUser = await user.save();
  response.status(201).json(savedUser);
});
userRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
  });
  return response.json(users);
});

module.exports = userRouter;
