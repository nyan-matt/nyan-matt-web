const themeKey = "nyan-matt-theme";
let preference: string | null = null;
try { preference = localStorage.getItem(themeKey); } catch {}

function applyTheme() {
  const theme = preference === "light" || preference === "dark"
    ? preference : "dark";
  document.documentElement.dataset.theme = theme;
  document.querySelectorAll<HTMLButtonElement>("[data-theme-toggle]").forEach((button) => {
    button.setAttribute("aria-checked", String(theme === "light"));
    button.title = `Switch to ${theme === "light" ? "dark" : "light"} theme`;
    const label = button.querySelector("[data-theme-label]");
    if (label) label.textContent = theme === "light" ? "Light" : "Dark";
  });
  window.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
}

document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    preference = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    try { localStorage.setItem(themeKey, preference); } catch {}
    applyTheme();
  });
});

window.addEventListener("storage", (event) => {
  if (event.key === themeKey || event.key === null) {
    preference = event.newValue;
    applyTheme();
  }
});
applyTheme();
