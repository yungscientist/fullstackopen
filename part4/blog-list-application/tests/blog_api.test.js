const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
jest.setTimeout(300000);

const api = supertest(app);
const initialBlogs = [
  {
    title: "On the Historical Unity of Russians and Ukrainians",
    author: "Vladimir Putin",
    url: "https://ru.wikisource.org/wiki/Об_историческом_единстве_русских_и_украинцев_(Путин)",
    likes: 999999,
  },
];
const initialUsers = [
  {
    name: "Vladimir Putin",
    username: "superuser",
    password: "zov1992",
  },
];
beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();

  await User.deleteMany({});
  let userObject = new User(initialUsers[0]);
  await userObject.save();
});
describe("POST", () => {
  test("post the blog", async () => {
    const newBlog = {
      title: "The Real Lessons of the 75th Anniversary of World War II",
      author: "Vladimir Putin",
      url: "https://nationalinterest.org/feature/vladimir-putin-real-lessons-75th-anniversary-world-war-ii-162982",
      likes: 999,
    };
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const response = await api.get("/api/blogs");
    const titles = response.body.map((r) => r.title);
    expect(response.body).toHaveLength(initialBlogs.length + 1);
    expect(titles).toContain(
      "The Real Lessons of the 75th Anniversary of World War II"
    );
  });
  test("if the likes property is missing from the request, it will default to the value 0", async () => {
    const newBlog = {
      title: "Offen sein, trotz der Vergangenheit",
      author: "Vladimir Putin",
      url: "https://www.zeit.de/politik/ausland/2021-06/ueberfall-auf-die-sowjetunion-1941-europa-russland-geschichte-wladimir-putin/komplettansicht",
    };
    await api.post("/api/blogs").send(newBlog).expect(201);
    const response = await api.get("/api/blogs");

    const likes = response.body.map((blog) => blog.likes);

    expect(likes).toBeDefined();
    expect(likes).toContain(0);
  });
  test("if the title and url properties are missing from the request data, the backend responds to the request with the status code 400 Bad Request", async () => {
    const newBlog = {
      author: "Joe Biden",
      likes: 0,
    };
    console.log("newBlog title", newBlog.title, "newBlog url", newBlog.url);
    await api.post("/api/blogs").send(newBlog).expect(400);
  });

  test("if username not given, should return 400", async () => {
    const newUser = {
      name: "Vladimir Putin",
      password: "zov19922",
    };

    await api.post("/api/users").send(newUser).expect(400);
  });
  test("if username or password are short than 3, should return 400", async () => {
    const newUser = {
      name: "Vladimir Putin",
      username: "superuser",
      password: "zov",
    };

    await api.post("/api/users").send(newUser).expect(400);
  });
});
describe("GET", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
  test("there is 1 blog in db", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(initialBlogs.length);
  });
  test("unique identifier is id", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body.map((blog) => blog.id)).toBeDefined();
  });
});
describe("DELETE", () => {
  test("delete a single blog post resource", async () => {
    const response = await api.get("/api/blogs");
    await api.delete(`/api/blogs/${response.body[0].id}`).expect(204);
    const secondResponse = await api.get("/api/blogs");
    expect(secondResponse.body).toHaveLength(initialBlogs.length - 1);
  });
});
describe("PUT", () => {
  test("update number of likes", async () => {
    const likesCount = 500;
    const response = await api.get("/api/blogs");
    const id = response.body[0].id;
    await api.put(`/api/blogs/${id}`).send({ likes: likesCount }).expect(200);
    const secondResponse = await api.get(`/api/blogs/${id}`);

    expect(secondResponse.body[0].likes).toBe(likesCount);
  });
});
afterAll(() => {
  mongoose.connection.close();
});
