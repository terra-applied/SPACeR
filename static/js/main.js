/* SPACeR site navigation + scroll-reveal. Slim port of the TerraZero main.js:
   only the header scroll-collapse / mobile nav / scroll-spy (initNav) and the
   IntersectionObserver scroll-reveal (initReveal). Math is handled by MathJax,
   so there is no renderMath here, and no demo gallery or integrations widget. */
(function () {
  "use strict";

  // ---- navigation ----------------------------------------------------------
  function initNav() {
    // the floating pill header stays fully visible at all scroll positions
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("nav");
    if (toggle && nav) {
      var setMenu = function (open) {
        nav.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.setAttribute("aria-label", open ? "Close navigation" : "Toggle navigation");
        document.body.classList.toggle("nav-open", open);
      };
      toggle.addEventListener("click", function () {
        setMenu(!nav.classList.contains("open"));
      });
      nav.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () { setMenu(false); });
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && nav.classList.contains("open")) setMenu(false);
      });
    }

    // scroll-spy
    var links = Array.prototype.slice.call(document.querySelectorAll("#nav a"));
    var map = {};
    links.forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      var sec = document.getElementById(id);
      if (sec) map[id] = a;
    });
    var sections = Object.keys(map).map(function (id) { return document.getElementById(id); });
    if (!("IntersectionObserver" in window) || !sections.length) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("active"); });
          var a = map[e.target.id];
          if (a) a.classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { obs.observe(s); });
  }

  // ---- scroll reveal -------------------------------------------------------
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (i) { i.classList.add("in"); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
    items.forEach(function (i) { obs.observe(i); });
  }

  // ---- boot ----------------------------------------------------------------
  function boot() {
    initNav();
    initReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
