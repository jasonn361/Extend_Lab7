import { auth, provider, signInWithPopup, signOut } from "./firebase.js";

// Utility function to check if an email is incomplete
const checkIncompleteEmail = (email) => {
  const emailParts = email.split("@");
  return emailParts.length === 1 || emailParts[1].trim() === "";
};

// Function to show error messages
const showErrorMessages = (errors) => {
  alert(errors.join("\n"));
};

document.addEventListener("DOMContentLoaded", () => {
  const formTitle = document.getElementById("form-title");
  const toggleText = document.getElementById("toggle-text");
  const signupForm = document.getElementById("signup-form");
  const loginForm = document.getElementById("login-form");
  const googleSignInButton = document.getElementById("google-signin");

  const updateToggleLink = () => {
    const toggleLink = document.getElementById("toggle-link");
    toggleLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (signupForm.style.display === "none") {
        signupForm.style.display = "block";
        loginForm.style.display = "none";
        formTitle.textContent = "Sign Up";
        toggleText.innerHTML =
          'Already have an account? <a href="#" id="toggle-link">Login here</a>';
      } else {
        signupForm.style.display = "none";
        loginForm.style.display = "block";
        formTitle.textContent = "Login";
        toggleText.innerHTML =
          'Don\'t have an account? <a href="#" id="toggle-link">Sign up here</a>';
      }
      updateToggleLink();
    });
  };

  updateToggleLink();

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("signup-username").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    const confirmPassword = document.getElementById("signup-confirm-password").value.trim();

    const errors = [];
    if (!username) {
      errors.push("Username is required.");
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.push("Invalid username. Use only letters, numbers, and underscores.");
    }
    if (!email) {
      errors.push("Email is required.");
    } else if (checkIncompleteEmail(email)) {
      const emailProvider = prompt("It seems like you forgot to add the domain part of your email. Is it gmail.com, hotmail.com, or another domain?");
      if (emailProvider) {
        document.getElementById("signup-email").value = `${email}@${emailProvider}`;
        return;
      } else {
        errors.push("Incomplete email.");
      }
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("Invalid email format.");
    }
    if (!password) {
      errors.push("Password is required.");
    } else if (password.length < 6) {
      errors.push("Password must be at least 6 characters long.");
    }
    if (password !== confirmPassword) {
      errors.push("Passwords do not match.");
    }

    if (errors.length > 0) {
      showErrorMessages(errors);
      return;
    }

    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, confirmPassword }),
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem("loggedInUser", JSON.stringify(result.user));
        alert("Signup successful");
        window.location.href = "/";
      } else {
        showErrorMessages([result.error]);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      showErrorMessages(["Signup failed. Please try again."]);
    }
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    const errors = [];
    if (!email) {
      errors.push("Email is required.");
    } else if (checkIncompleteEmail(email)) {
      const emailProvider = prompt("It seems like you forgot to add the domain part of your email. Is it gmail.com, hotmail.com, or another domain?");
      if (emailProvider) {
        document.getElementById("login-email").value = `${email}@${emailProvider}`;
        return;
      } else {
        errors.push("Incomplete email.");
      }
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("Invalid email format.");
    }
    if (!password) {
      errors.push("Password is required.");
    }

    if (errors.length > 0) {
      showErrorMessages(errors);
      return;
    }

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem("loggedInUser", JSON.stringify(result.user));
        alert("Login successful");
        window.location.href = "/";
      } else {
        showErrorMessages([result.error]);
      }
    } catch (error) {
      console.error("Error during login:", error);
      showErrorMessages(["Login failed. Please try again."]);
    }
  });

  googleSignInButton.addEventListener("click", () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        const userData = {
          username: user.displayName,
          email: user.email,
        };
        localStorage.setItem("loggedInUser", JSON.stringify(userData));
        alert("Login successful");
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Error during Google sign-in:", error);
        alert("Google sign-in failed. Please try again.");
      });
  });
});
