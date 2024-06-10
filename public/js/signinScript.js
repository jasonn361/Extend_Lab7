document.addEventListener("DOMContentLoaded", () => {
  const formTitle = document.getElementById("form-title");
  const toggleText = document.getElementById("toggle-text");
  const signupForm = document.getElementById("signup-form");
  const loginForm = document.getElementById("login-form");

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
    const username = document.getElementById("signup-username").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById(
      "signup-confirm-password"
    ).value;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
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
      if (response.headers.get("content-type").includes("application/json")) {
        const result = await response.json();
        if (response.ok) {
          localStorage.setItem("loggedInUser", JSON.stringify(result.user));
          alert("Signup successful");
          window.location.href = "/";
        } else {
          alert(result.error);
        }
      } else {
        console.error("Unexpected response:", await response.text());
        alert("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Signup failed. Please try again.");
    }
  });

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
