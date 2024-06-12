// controllers/profile.js
const User = require("../models/User");

async function getProfile(request, response) {
  const userId = request.session.userId;
  if (!userId) {
    return response.redirect("/signup");
  }

  try {
    const user = await User.findById(userId).lean();
    if (!user) {
      return response.status(404).send("User not found");
    }

    response.render("profile", { title: "Profile", user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    response.status(500).send("Internal Server Error");
  }
}

async function updateProfile(request, response) {
  const userId = request.session.userId;
  if (!userId) {
    return response.redirect("/signup");
  }

  const { bio, location } = request.body;

  try {
    await User.findByIdAndUpdate(userId, { bio, location });
    response.sendStatus(200); // Send OK status
  } catch (error) {
    console.error("Error updating profile:", error);
    response.status(500).send("Internal Server Error");
  }
}

module.exports = {
  getProfile,
  updateProfile,
};
