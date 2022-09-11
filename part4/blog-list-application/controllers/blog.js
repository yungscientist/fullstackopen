const express = require("express");
const blogsRouter = express.Router();
const Blog = require("../models/blog");
const logger = require("../utils/logger");
const mongoose = require("mongoose");
const { response } = require("../app");
const { status } = require("express/lib/response");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  return response.json(blogs);
});
blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.find({ _id: request.params.id });
  return response.json(blog);
});

blogsRouter.post("/", async (request, response) => {
  const { title, author, url, likes, userId, token } = request.body;
  const user = await User.findById(userId);
  if (user.token != token) {
    return response.status(400).json({ error: "wrong token!" });
  }
  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    user: user._id,
    likes: likes,
  });
  if (blog.likes === undefined) {
    blog.likes = 0;
  }

  if ((blog.title && blog.url) === undefined) {
    return response.status(400).end();
  }

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  logger.info(blog);
  const result = await blog.save();
  return response.status(201).json(result);
});
blogsRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;
  await Blog.deleteOne({ _id: id });
  return response.status(204).end();
});
blogsRouter.put("/:id", async (request, response) => {
  const id = request.params.id;
  const likesCount = request.body.likes;
  await Blog.findOneAndUpdate(id, { likes: likesCount });
  response.status(200).end();
});
module.exports = blogsRouter;
