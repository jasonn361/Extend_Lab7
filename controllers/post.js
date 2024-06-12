// controllers/post.js
const Post = require("../models/Post");

async function createPost(request, response) {
  const userId = request.session.userId;
  if (!userId) {
    return response.redirect("/signup");
  }

  const { content } = request.body;

  try {
    const newPost = new Post({ userId, content });
    await newPost.save();
    response.redirect("/profile");
  } catch (error) {
    console.error("Error creating post:", error);
    response.status(500).send("Internal Server Error");
  }
}

async function getUserPosts(request, response) {
  const userId = request.session.userId;
  if (!userId) {
    return response.redirect("/signup");
  }

  try {
    const posts = await Post.find({ userId }).sort({ createdAt: -1 }).lean();
    response.json(posts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    response.status(500).send("Internal Server Error");
  }
}

module.exports = {
  createPost,
  getUserPosts,
};
