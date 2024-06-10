const User = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;

async function getSignup(request, response) {
  response.render("signup", { title: "Sign Up / Login" });
}

async function postSignup(request, response) {
  const { username, email, password, confirmPassword } = request.body;

  console.log("Received signup request:", request.body);

  if (password !== confirmPassword) {
    return response.status(400).json({ error: "Passwords do not match" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    console.log("User saved:", newUser);

    response
      .status(201)
      .json({ user: { username: newUser.username, email: newUser.email } });
  } catch (error) {
    console.error("Error signing up:", error);
    response.status(500).json({ error: "Failed to sign up" });
  }
}

async function postLogin(request, response) {
  const { email, password } = request.body;

  console.log("Received login request:", request.body);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return response.status(400).json({ error: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return response.status(400).json({ error: "Incorrect password" });
    }

    response
      .status(200)
      .json({ user: { username: user.username, email: user.email } });
  } catch (error) {
    console.error("Error logging in:", error);
    response.status(500).json({ error: "Failed to log in" });
  }
}

async function logout(request, response) {
  request.session.destroy(() => {
    response.redirect("/");
  });
}

module.exports = {
  getSignup,
  postSignup,
  postLogin,
  logout,
};
