const dummy = (blogs) => {
  return 1;
};
const totalLikes = (blogs) => {
  if (blogs.length == 1) {
    return Number(blogs.map((blog) => blog.likes));
  } else {
    return blogs.reduce((previous, current) => {
      const result = previous + current.likes;

      return result;
    }, 0);
  }
};
const favoriteBlog = (blogs) => {
  let likes = [];
  blogs.map((blog) => likes.push(blog.likes));
  return blogs[likes.indexOf(Math.max.apply(null, likes))];
};
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
