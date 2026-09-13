(function () {
  "use strict";

  console.log("[portfolio] script.js loaded, running setup...");

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Runs fn immediately. If it throws, the error is logged with a clear
  // label instead of silently breaking every feature defined after it.
  function safe(label, fn) {
    try {
      fn();
    } catch (e) {
      console.error("[portfolio] \"" + label + "\" failed to set up:", e);
    }
  }

  /* ---------- Mobile menu ---------- */

  safe("mobile menu", function () {
    var menuToggle = document.getElementById("menuToggle");
    var sidebar = document.getElementById("sidebar");
    var overlay = document.getElementById("sidebarOverlay");

    if (!menuToggle || !sidebar || !overlay) return;

    function closeMenu() {
      sidebar.classList.remove("open");
      overlay.classList.remove("show");
      menuToggle.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }

    function openMenu() {
      sidebar.classList.add("open");
      overlay.classList.add("show");
      menuToggle.classList.add("open");
      menuToggle.setAttribute("aria-expanded", "true");
    }

    menuToggle.addEventListener("click", function () {
      if (sidebar.classList.contains("open")) closeMenu();
      else openMenu();
    });

    overlay.addEventListener("click", closeMenu);

    document.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  });

  /* ---------- Theme toggle ---------- */

  safe("theme toggle", function () {
    var themeToggles = document.querySelectorAll(".theme-toggle");
    if (!themeToggles.length) return;

    function syncToggleState() {
      var current = document.documentElement.getAttribute("data-theme") || "dark";
      themeToggles.forEach(function (btn) {
        btn.setAttribute("aria-pressed", String(current === "light"));
        btn.setAttribute("aria-label", current === "light" ? "Switch to dark mode" : "Switch to light mode");
      });
    }

    syncToggleState();
    themeToggles.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var current = document.documentElement.getAttribute("data-theme") || "dark";
        var next = current === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        try { localStorage.setItem("theme", next); } catch (e) { /* storage unavailable, theme just won't persist */ }
        syncToggleState();
      });
    });

    // Smooth color transitions for theme switches, enabled only after the
    // first paint has settled so the initial page load never animates.
    window.setTimeout(function () {
      document.documentElement.classList.add("theme-ready");
    }, 80);
  });

  /* ---------- Typewriter reveal for headings ----------
     The hero comment line types first, then the hero heading, then the
     buttons/stats cascade in once that's done. Every other section
     heading types the first time it scrolls into view. Each element
     only ever plays its animation once per page load. */

  safe("heading typewriter", function () {
    var heroCommentEl = document.querySelector(".hero-comment");
    var heroTitleEl = document.getElementById("heroTitle");
    var sectionHeadings = Array.prototype.slice.call(document.querySelectorAll(".section-title"));
    var heroSubEl = document.querySelector(".hero-sub");
    var heroActionsEl = document.querySelector(".hero-actions");
    var heroFactsEl = document.querySelector(".hero-facts");

    // Clear every target up front (synchronously) so nothing flashes its
    // full text before its turn to type comes up.
    if (heroTitleEl) {
      heroTitleEl.dataset.fullText = heroTitleEl.textContent;
      heroTitleEl.textContent = "";
    }
    sectionHeadings.forEach(function (el) {
      el.dataset.fullText = el.textContent;
      el.textContent = "";
    });

    function scheduleHeroFollowUps(typingDurationMs) {
      var base = (typingDurationMs + 200) / 1000;
      if (heroSubEl) heroSubEl.style.animationDelay = base.toFixed(2) + "s";
      if (heroActionsEl) heroActionsEl.style.animationDelay = (base + 0.18).toFixed(2) + "s";
      if (heroFactsEl) heroFactsEl.style.animationDelay = (base + 0.32).toFixed(2) + "s";
    }

    // For headings: a small inline cursor span is inserted and removed
    // once typing finishes.
    function typeHeading(el, speed, onDone) {
      var text = el.dataset.fullText || el.textContent;
      el.dataset.fullText = text;
      el.textContent = "";

      var cursor = document.createElement("span");
      cursor.className = "type-cursor";
      el.appendChild(cursor);

      var i = 0;
      function step() {
        if (i < text.length) {
          cursor.insertAdjacentText("beforebegin", text.charAt(i));
          i++;
          setTimeout(step, speed);
        } else {
          setTimeout(function () {
            if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
          }, 450);
          if (onDone) onDone(text.length * speed);
        }
      }
      step();
    }

    // For the comment line: it already has a CSS blinking cursor (::after)
    // that naturally tracks the end of the text as it grows, so no extra
    // cursor element is needed here.
    function typeComment(el, speed, onDone) {
      var text = el.dataset.fullText || el.textContent;
      el.dataset.fullText = text;
      el.textContent = "";

      var i = 0;
      function step() {
        if (i < text.length) {
          el.textContent += text.charAt(i);
          i++;
          setTimeout(step, speed);
        } else if (onDone) {
          onDone();
        }
      }
      step();
    }

    // Hero sequence: comment, then heading, then the rest cascades in.
    if (heroCommentEl && heroTitleEl) {
      typeComment(heroCommentEl, 30, function () {
        typeHeading(heroTitleEl, 55, scheduleHeroFollowUps);
      });
    } else if (heroTitleEl) {
      typeHeading(heroTitleEl, 55, scheduleHeroFollowUps);
    } else if (heroCommentEl) {
      typeComment(heroCommentEl, 30);
    }

    // Every other section heading types once, the first time it scrolls
    // into view.
    if (sectionHeadings.length) {
      if ("IntersectionObserver" in window) {
        var headingObserver = new IntersectionObserver(
          function (entries, obs) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                typeHeading(entry.target, 40);
                obs.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.4 }
        );
        sectionHeadings.forEach(function (el) { headingObserver.observe(el); });
      } else {
        sectionHeadings.forEach(function (el) { el.textContent = el.dataset.fullText || el.textContent; });
      }
    }

    console.log(
      "[portfolio] typewriter set up — comment:", !!heroCommentEl,
      "hero:", !!heroTitleEl,
      "section headings:", sectionHeadings.length
    );
  });

  /* ---------- Scroll-spy navigation ---------- */

  safe("scroll-spy nav", function () {
    var sections = Array.prototype.slice.call(document.querySelectorAll("main .section, .hero"));
    var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
    var navIndicator = document.getElementById("navIndicator");

    function moveIndicator(link) {
      if (!navIndicator || !link) return;
      navIndicator.style.opacity = "1";
      navIndicator.style.height = link.offsetHeight + "px";
      navIndicator.style.transform = "translateY(" + link.offsetTop + "px)";
    }

    function setActive(id) {
      navLinks.forEach(function (link) {
        var isActive = link.dataset.section === id;
        link.classList.toggle("active", isActive);
        if (isActive) moveIndicator(link);
      });
    }

    window.addEventListener("resize", function () {
      var current = document.querySelector(".nav-link.active");
      if (current) moveIndicator(current);
    });

    if ("IntersectionObserver" in window) {
      var spy = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) setActive(entry.target.id);
          });
        },
        { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
      );
      sections.forEach(function (s) { spy.observe(s); });
    }

    // Avoid a flash of no active state before the first observer callback fires
    if (navLinks.length) {
      navLinks[0].classList.add("active");
      moveIndicator(navLinks[0]);
    }
  });

  /* ---------- Generic scroll reveal for section content ---------- */

  safe("scroll reveal", function () {
    var revealEls = document.querySelectorAll(".reveal");
    if (!revealEls.length) return;

    if ("IntersectionObserver" in window && !reducedMotion) {
      var revealObserver = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      revealEls.forEach(function (el) { revealObserver.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("in-view"); });
    }
  });

  /* ---------- Video grid rendering ---------- */

  safe("video grid", function () {
    var grid = document.getElementById("videoGrid");
    if (!grid) return;

    var data = typeof VIDEOS !== "undefined" ? VIDEOS : [];

    function escapeHtml(str) {
      var div = document.createElement("div");
      div.textContent = str == null ? "" : String(str);
      return div.innerHTML;
    }

    function playIcon() {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 4l14 8-14 8z" fill="currentColor" stroke="none"/></svg>';
    }

    function buildVideoCard(item) {
      var card = document.createElement("article");

      if (item.type === "placeholder" || !item.type) {
        card.className = "video-card placeholder";
        card.innerHTML =
          '<div class="placeholder-inner">' +
          "<p>" + escapeHtml(item.title || "Add a project") + "</p>" +
          "<p>" + escapeHtml(item.description || "") + "</p>" +
          "</div>";
        return card;
      }

      card.className = "video-card";

      var frame = document.createElement("div");
      frame.className = "video-frame";
      frame.innerHTML = '<div class="play-btn">' + playIcon() + "</div>";

      frame.addEventListener("click", function loadMedia() {
        frame.removeEventListener("click", loadMedia);
        if (item.type === "youtube" && item.src) {
          var iframe = document.createElement("iframe");
          iframe.src = "https://www.youtube.com/embed/" + item.src + "?autoplay=1&rel=0";
          iframe.title = item.title || "Project video";
          iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
          iframe.allowFullscreen = true;
          frame.innerHTML = "";
          frame.appendChild(iframe);
        } else if (item.type === "medal" && item.src) {
          var medalIframe = document.createElement("iframe");
          medalIframe.src = item.src;
          medalIframe.title = item.title || "Project clip";
          medalIframe.allow = "autoplay; fullscreen";
          medalIframe.allowFullscreen = true;
          medalIframe.style.border = "0";
          frame.innerHTML = "";
          frame.appendChild(medalIframe);
        } else if (item.type === "file" && item.src) {
          var video = document.createElement("video");
          video.src = item.src;
          video.controls = true;
          video.autoplay = true;
          frame.innerHTML = "";
          frame.appendChild(video);
        }
      });

      var body = document.createElement("div");
      body.className = "video-body";

      var tagsHtml = "";
      if (Array.isArray(item.tags)) {
        tagsHtml = item.tags
          .map(function (t) { return '<span class="tag">' + escapeHtml(t) + "</span>"; })
          .join("");
      }

      body.innerHTML =
        "<h3>" + escapeHtml(item.title || "") + "</h3>" +
        "<p>" + escapeHtml(item.description || "") + "</p>" +
        '<div class="tag-row">' + tagsHtml + "</div>";

      card.appendChild(frame);
      card.appendChild(body);
      return card;
    }

    data.forEach(function (item) {
      grid.appendChild(buildVideoCard(item));
    });

    var cards = grid.querySelectorAll(".video-card:not(.placeholder)");
    if ("IntersectionObserver" in window && !reducedMotion) {
      var reveal = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      cards.forEach(function (c) { reveal.observe(c); });
    } else {
      cards.forEach(function (c) { c.classList.add("in-view"); });
    }
  });

  /* ---------- Subtle 3D tilt on cards (desktop, non-touch only) ---------- */

  safe("card tilt", function () {
    var supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!supportsHover || reducedMotion) return;

    document.querySelectorAll(".card.tilt").forEach(function (card) {
      var rect;

      card.addEventListener("mouseenter", function () {
        rect = card.getBoundingClientRect();
      });

      card.addEventListener("mousemove", function (e) {
        if (!rect) rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        var rotateX = (y * -6).toFixed(2);
        var rotateY = (x * 6).toFixed(2);
        card.style.transform = "perspective(600px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg)";
      });

      card.addEventListener("mouseleave", function () {
        card.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg)";
      });
    });
  });

  /* ---------- Policy accordion ---------- */

  safe("policy accordion", function () {
    document.querySelectorAll(".policy-head").forEach(function (btn) {
      var body = btn.nextElementSibling;

      btn.addEventListener("click", function () {
        var isOpen = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!isOpen));
        body.style.maxHeight = isOpen ? "0px" : body.scrollHeight + "px";
      });
    });
  });

  /* ---------- Copy Discord username ---------- */

  safe("copy discord button", function () {
    var copyBtn = document.getElementById("copyDiscord");
    var handle = document.getElementById("discordHandle");
    if (!copyBtn || !handle) return;

    copyBtn.addEventListener("click", function () {
      var text = handle.textContent.trim();
      var done = function () {
        var original = copyBtn.textContent;
        copyBtn.textContent = "Copied";
        setTimeout(function () { copyBtn.textContent = original; }, 1600);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(done);
      } else {
        done();
      }
    });
  });

  console.log("[portfolio] setup complete");
})();
