/* =============================================
   MAIN.JS — Shared behaviors across all pages
   Navbar, dropdown, mobile menu, accordion, tabs,
   carousel, back-to-top, cookie banner, footer accordion
============================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Sticky navbar shadow on scroll ---------- */
  var navbar = document.querySelector(".navbar");
  if (navbar) {
    var onScroll = function () {
      if (window.scrollY > 8) navbar.classList.add("is-scrolled");
      else navbar.classList.remove("is-scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Navbar dropdown (click to open, click outside closes) ---------- */
  document.querySelectorAll(".navbar__dropdown").forEach(function (dropdown) {
    var trigger = dropdown.querySelector(".navbar__link");
    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      var isOpen = dropdown.classList.contains("is-open");
      document.querySelectorAll(".navbar__dropdown.is-open").forEach(function (d) { d.classList.remove("is-open"); });
      if (!isOpen) dropdown.classList.add("is-open");
    });
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".navbar__dropdown")) {
      document.querySelectorAll(".navbar__dropdown.is-open").forEach(function (d) { d.classList.remove("is-open"); });
    }
  });

  /* ---------- Mobile menu toggle ---------- */
  var toggle = document.querySelector(".navbar__toggle");
  var mobileMenu = document.querySelector(".navbar__mobile");
  var mobileClose = document.querySelector(".navbar__mobile-close");
  function openMobile() {
    mobileMenu.classList.add("is-open");
    document.body.style.overflow = "hidden";
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { mobileMenu.classList.add("is-visible"); });
    });
  }
  function closeMobile() {
    mobileMenu.classList.remove("is-visible");
    document.body.style.overflow = "";
    setTimeout(function () { mobileMenu.classList.remove("is-open"); }, 250);
  }
  if (toggle && mobileMenu) {
    toggle.addEventListener("click", openMobile);
    if (mobileClose) mobileClose.addEventListener("click", closeMobile);
    mobileMenu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMobile); });
  }

  /* ---------- Accordion (FAQ, Legal TOC) ---------- */
  document.querySelectorAll(".accordion").forEach(function (accordion) {
    var allowMultiple = accordion.dataset.multiple === "true";
    accordion.querySelectorAll(".accordion__item").forEach(function (item) {
      var trigger = item.querySelector(".accordion__trigger");
      var panel = item.querySelector(".accordion__panel");
      trigger.addEventListener("click", function () {
        var isOpen = item.classList.contains("accordion__item--open");
        if (!allowMultiple) {
          accordion.querySelectorAll(".accordion__item--open").forEach(function (openItem) {
            if (openItem !== item) {
              openItem.classList.remove("accordion__item--open");
              openItem.querySelector(".accordion__panel").style.maxHeight = null;
            }
          });
        }
        if (isOpen) {
          item.classList.remove("accordion__item--open");
          panel.style.maxHeight = null;
        } else {
          item.classList.add("accordion__item--open");
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    });
  });

  /* ---------- Tabs (Use-cases, Features sub-nav, Pricing tables) ---------- */
  document.querySelectorAll("[data-tabs]").forEach(function (tabsRoot) {
    var tabs = tabsRoot.querySelectorAll(".tabs__tab");
    var panels = tabsRoot.querySelectorAll(".tabs__panel");
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.classList.remove("tabs__tab--active"); });
        panels.forEach(function (p) { p.classList.remove("tabs__panel--active"); });
        tab.classList.add("tabs__tab--active");
        if (panels[i]) panels[i].classList.add("tabs__panel--active");
      });
    });
  });

  /* ---------- Testimonial carousel (auto-advance + dots) ---------- */
  document.querySelectorAll("[data-carousel]").forEach(function (carousel) {
    var slides = carousel.querySelectorAll(".carousel__slide");
    var dots = carousel.querySelectorAll(".carousel__dot");
    var index = 0;
    var timer;
    function show(i) {
      slides.forEach(function (s) { s.classList.remove("carousel__slide--active"); });
      dots.forEach(function (d) { d.classList.remove("carousel__dot--active"); });
      slides[i].classList.add("carousel__slide--active");
      if (dots[i]) dots[i].classList.add("carousel__dot--active");
      index = i;
    }
    function next() { show((index + 1) % slides.length); }
    function restart() { clearInterval(timer); timer = setInterval(next, 5000); }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () { show(i); restart(); });
    });
    if (slides.length) { show(0); restart(); }
  });

  /* ---------- Back to top ---------- */
  var backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 600) backToTop.classList.add("is-visible");
      else backToTop.classList.remove("is-visible");
    }, { passive: true });
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Cookie consent banner ---------- */
  var cookieBanner = document.querySelector(".cookie-banner");
  if (cookieBanner) {
    if (!localStorage.getItem("meridian_cookie_ack")) {
      cookieBanner.classList.add("is-visible");
    }
    var cookieBtn = cookieBanner.querySelector(".cookie-banner__btn");
    if (cookieBtn) {
      cookieBtn.addEventListener("click", function () {
        localStorage.setItem("meridian_cookie_ack", "1");
        cookieBanner.classList.remove("is-visible");
      });
    }
  }

  /* ---------- Pricing billing toggle (monthly/annual mock) ---------- */
  var billingToggle = document.querySelector("[data-toggle='billing']");
  if (billingToggle) {
    var monthlyLabel = document.querySelector("[data-billing-label='monthly']");
    var annualLabel = document.querySelector("[data-billing-label='annual']");
    billingToggle.addEventListener("click", function () {
      var isAnnual = billingToggle.classList.toggle("is-on");
      if (monthlyLabel) monthlyLabel.classList.toggle("is-active", !isAnnual);
      if (annualLabel) annualLabel.classList.toggle("is-active", isAnnual);
      document.querySelectorAll("[data-price-monthly]").forEach(function (el) {
        el.textContent = isAnnual ? el.dataset.priceAnnual : el.dataset.priceMonthly;
      });
      document.querySelectorAll("[data-period]").forEach(function (el) {
        el.textContent = isAnnual ? "/user/mo, billed annually" : "/user/mo, billed monthly";
      });
    });
  }

  /* ---------- Footer mobile accordion ---------- */
  document.querySelectorAll(".footer__col:not(.footer__brand-col) .footer__heading").forEach(function (heading) {
    heading.addEventListener("click", function () {
      if (window.innerWidth > 640) return;
      heading.closest(".footer__col").classList.toggle("is-open");
    });
  });

});
