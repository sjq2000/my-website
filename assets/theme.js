/* ==========================================================================
   SJQ 主题切换
   - 读取 localStorage 的 sjq-theme（dark / light），在 <html> 上设置 data-theme
   - 在 <nav> 里插入一个圆形切换按钮
   - 这个脚本放在 <head> 里同步执行，避免先闪一下深色
   ========================================================================== */
(function () {
  var KEY = "sjq-theme";
  var root = document.documentElement;

  function read() {
    try { return localStorage.getItem(KEY) === "light" ? "light" : "dark"; }
    catch (e) { return "dark"; }
  }

  function apply(theme) {
    if (theme === "light") root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");

    var btn = document.getElementById("themeToggle");
    if (btn) {
      var light = theme === "light";
      btn.textContent = light ? "\u263E" : "\u2600";
      btn.title = light ? "切换到夜间模式" : "切换到日间模式";
      btn.setAttribute("aria-label", btn.title);
      btn.setAttribute("aria-pressed", light ? "true" : "false");
    }
  }

  // 先设属性，<body> 还没解析，所以不会闪
  apply(read());

  function mount() {
    var nav = document.querySelector("nav");
    if (!nav || document.getElementById("themeToggle")) return;
    var btn = document.createElement("button");
    btn.id = "themeToggle";
    btn.className = "theme-toggle";
    btn.type = "button";
    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      try { localStorage.setItem(KEY, next); } catch (e) {}
      apply(next);
    });
    var links = nav.querySelector(".nav-links");
    // 放到导航最右侧（语言切换按钮之前/之后都可以，靠右即可）
    nav.appendChild(btn);
    apply(read());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
