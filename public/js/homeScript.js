document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".room-link").forEach((link) => {
    link.addEventListener("click", () => {
      localStorage.removeItem("nickname");
    });
  });

  const authButtons = document.getElementById("auth-buttons");
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (loggedInUser) {
    authButtons.innerHTML = `
            <span class="mr-2">Welcome, ${loggedInUser.username}</span>
            <button id="logout-button" class="btn btn-secondary mb-2">Logout</button>
        `;

    document.getElementById("logout-button").addEventListener("click", () => {
      localStorage.removeItem("loggedInUser");
      window.location.href = "/";
    });
  } else {
    authButtons.innerHTML = `
            <a href="/signup" class="btn btn-secondary mb-2">Sign Up / Login</a>
        `;
  }
});
