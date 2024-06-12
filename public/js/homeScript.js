// public/js/homeScript.js
import { auth, signOut } from "./firebase.js";

document.addEventListener("DOMContentLoaded", () => {
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
      <a href="/signup" class="btn btn-secondary mb-2">Sign Up</a>
      <a href="#" id="login-button" class="btn btn-secondary mb-2">Login</a>
    `;
  }

  const loginButton = document.getElementById("login-button");

  if (loginButton) {
    loginButton.addEventListener("click", () => {
      const loginForm = document.createElement("form");
      loginForm.id = "login-form";
      loginForm.innerHTML = `
        <div class="form-group">
          <label for="login-email">Email</label>
          <input type="email" id="login-email" class="form-control" placeholder="Enter your email" required />
        </div>
        <div class="form-group">
          <label for="login-password">Password</label>
          <input type="password" id="login-password" class="form-control" placeholder="Enter your password" required />
        </div>
        <button type="submit" class="btn btn-primary mt-3">Login</button>
      `;
      document.body.appendChild(loginForm);

      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        try {
          const response = await fetch("/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });
          if (response.headers.get("content-type").includes("application/json")) {
            const result = await response.json();
            if (response.ok) {
              localStorage.setItem("loggedInUser", JSON.stringify(result.user));
              alert("Login successful");
              window.location.href = "/";
            } else {
              alert(result.error);
            }
          } else {
            console.error("Unexpected response:", await response.text());
            alert("Unexpected response from server.");
          }
        } catch (error) {
          console.error("Error during login:", error);
          alert("Login failed. Please try again.");
        }
      });
    });
  }
});
