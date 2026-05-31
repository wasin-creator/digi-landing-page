/* DIGI — interactions: nav state, reveal-on-scroll, hero parallax, filters */
(function () {
  "use strict";

  /* ---- Sticky nav background on scroll ---- */
  var nav = document.getElementById("nav");
  var onScroll = function () {
    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Reveal on scroll ---- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  var reveal = function (el) { el.classList.add("in"); };
  var inView = function (el) {
    var r = el.getBoundingClientRect();
    return r.top < (window.innerHeight || document.documentElement.clientHeight) * 0.92 && r.bottom > 0;
  };
  // Reveal anything already on-screen at load immediately.
  var revealInView = function () {
    for (var i = reveals.length - 1; i >= 0; i--) {
      if (inView(reveals[i])) { reveal(reveals[i]); reveals.splice(i, 1); }
    }
  };
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }
  // Always-on scroll + resize listeners so any scroll (incl. jumps) reveals.
  window.addEventListener("scroll", revealInView, { passive: true });
  window.addEventListener("resize", revealInView);
  // Belt-and-braces: reveal in-view on load, next frame, and short timers.
  revealInView();
  requestAnimationFrame(revealInView);
  window.addEventListener("load", revealInView);
  setTimeout(revealInView, 200);
  setTimeout(revealInView, 600);
  setTimeout(function () {
    Array.prototype.forEach.call(document.querySelectorAll("[data-reveal]:not(.in)"), reveal);
  }, 1500);

  /* ---- Hero parallax (subtle) ---- */
  var heroMedia = document.querySelector(".hero__media");
  var heroInner = document.querySelector(".hero__inner");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (heroMedia && !reduce) {
    var raf = null;
    var onHero = function () {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < window.innerHeight) {
          heroMedia.style.transform = "scale(1.06) translateY(" + (y * 0.18) + "px)";
          if (heroInner) {
            heroInner.style.transform = "translateY(" + (y * -0.06) + "px)";
            heroInner.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.75)));
          }
        }
        raf = null;
      });
    };
    heroMedia.style.transform = "scale(1.06)";
    window.addEventListener("scroll", onHero, { passive: true });
  }

  /* ---- Portfolio filter ---- */
  var filters = document.querySelectorAll(".filter");
  var cases = document.querySelectorAll(".case");
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filters.forEach(function (f) { f.classList.remove("active"); });
      btn.classList.add("active");
      var cat = btn.getAttribute("data-filter");
      cases.forEach(function (c) {
        var cats = (c.getAttribute("data-cat") || "");
        var show = cat === "all" || cats.indexOf(cat) !== -1;
        c.classList.toggle("case--hidden", !show);
      });
    });
  });

  /* ---- Mobile burger: smooth-scroll fallback menu ---- */
  var burger = document.querySelector(".nav__burger");
  if (burger) {
    burger.addEventListener("click", function () {
      var c = document.getElementById("contact");
      if (c) c.scrollIntoView({ behavior: "smooth" });
    });
  }
})();
