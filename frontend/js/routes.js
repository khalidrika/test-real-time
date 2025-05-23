import { renderLoginForm, renderRegisterForm } from "./auth.js";
import { loadCurrentUser, renderUsers } from "./chat.js";
import { renderPosts } from "./post.js";
import { socketEvent, UpgredConnetion } from "./ws.js";

let routes = {};

window.addEventListener("DOMContentLoaded", () => {
  routes = {
    '/login': renderLoginForm,
    '/register': renderRegisterForm,
    '/home': async () => {
      try {
        await renderPosts();
        await loadCurrentUser();
        UpgredConnetion();
        socketEvent();
        renderUsers();
      } catch (error) {
        console.error("Failed to render posts:", error);
      }
    },
  };
  checkSessionAndRedirect();
});

async function checkSessionAndRedirect() {
  try {
    const res = await fetch("/api/me");
    if (!res.ok) {
      navigate("/login");
      return
    } else {
      navigate("/home");
    }
  } catch (err) {
    console.error("Session check failed:", err)
    navigate("/login")
  }
}


export function navigate(path) {
  history.pushState({}, '', path);
  renderPage(path);
}


export function renderPage(path) {
  if (routes[path]) {
    routes[path]()
  } else {
    navigate("/login")
  }

}

window.addEventListener('popstate', () => {
  console.log("-----------------1a");
  checkSessionAndRedirect()
})