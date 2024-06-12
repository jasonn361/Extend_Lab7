// public/js/homeScript.js
import { auth, signOut } from "./firebase.js";

const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
console.log(loggedInUser);

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".room-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      if (!loggedInUser) {
          e.preventDefault();
          alert('Please sign up or login to enter the room.');
      }
    });
  });

  document.getElementById("create-btn").addEventListener("click", (e) => {
    if (!loggedInUser) {
      e.preventDefault();
      alert('Please sign up or login to create the room.');
    }
  });

  const authButtons = document.getElementById("auth-buttons");
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (loggedInUser) {
    authButtons.innerHTML = `
        <span class="mr-2">Welcome, ${loggedInUser.username}</span>
        <a href="/profile" class="btn btn-primary mb-2">Profile</a>
        <button id="logout-button" class="btn btn-secondary mb-2">Logout</button>
    `;

    document.getElementById("logout-button").addEventListener("click", () => {
      signOut(auth)
        .then(() => {
          localStorage.removeItem("loggedInUser");
          window.location.href = "/";
        })
        .catch((error) => {
          console.error("Error during sign out:", error);
        });
    });
  } else {
    authButtons.innerHTML = `
        <a href="/signup" class="btn btn-secondary mb-2">Sign Up / Login</a>
    `;
  }
});
