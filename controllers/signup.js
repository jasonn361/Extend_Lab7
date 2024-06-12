// controllers/signup.js
const User = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Utility function to sanitize input
const sanitizeInput = (input) => {
  return input.replace(/'/g, "''").trim();
};

// Utility function to validate email
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Utility function to validate username
const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  return usernameRegex.test(username);
};

// Utility function to validate password
const validatePassword = (password) => {
  return password.length >= 6;
};

async function getSignup(request, response) {
  response.render("signup", { title: "Sign Up / Login" });
}

async function postSignup(request, response) {
  let { username, email, password, confirmPassword } = request.body;

  console.log("Received signup request:", request.body);

  // Sanitize input
  username = sanitizeInput(username);
  email = sanitizeInput(email);
  password = sanitizeInput(password);
  confirmPassword = sanitizeInput(confirmPassword);

  // Validate input
  const errors = [];
  if (!validateUsername(username)) {
    errors.push("Invalid username. Use only letters, numbers, and underscores.");
  }
  if (!validateEmail(email)) {
    errors.push("Invalid email format.");
  }
  if (!validatePassword(password)) {
    errors.push("Password must be at least 6 characters long.");
  }
  if (password !== confirmPassword) {
    errors.push("Passwords do not match.");
  }

  if (errors.length > 0) {
    return response.status(400).json({ errors });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    console.log("User saved:", newUser);

    // Store user ID in session
    request.session.userId = newUser._id;

    response
      .status(201)
      .json({ user: { username: newUser.username, email: newUser.email } });
  } catch (error) {
    console.error("Error signing up:", error);
    if (error.code === 11000) { // Duplicate key error
      if (error.keyPattern.email) {
        return response.status(400).json({ error: "Email already in use." });
      }
      if (error.keyPattern.username) {
        return response.status(400).json({ error: "Username already in use." });
      }
    }
    response.status(500).json({ error: "Failed to sign up" });
  }
}

async function postLogin(request, response) {
  let { email, password } = request.body;

  console.log("Received login request:", request.body);

  // Sanitize input
  email = sanitizeInput(email);
  password = sanitizeInput(password);

  // Validate input
  const errors = [];
  if (!validateEmail(email)) {
    errors.push("Invalid email format.");
  }
  if (!validatePassword(password)) {
    errors.push("Invalid password.");
  }

  if (errors.length > 0) {
    return response.status(400).json({ errors });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return response.status(400).json({ error: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return response.status(400).json({ error: "Incorrect password" });
    }

    // Store user ID in session
    request.session.userId = user._id;

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
