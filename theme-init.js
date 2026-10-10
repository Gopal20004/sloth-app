// Runs before the app bundle so the first paint already uses the saved theme (no flash).
// Kept external because the Content-Security-Policy does not allow inline scripts.
(function () {
  try {
    var theme = localStorage.getItem("sloth-theme-v2") === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) { document.documentElement.setAttribute("data-theme", "dark"); }
})();
