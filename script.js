const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
const storedTheme = localStorage.getItem("theme");

const applyTheme = (theme) => {
  if (theme) {
    root.setAttribute("data-theme", theme);
  } else {
    root.removeAttribute("data-theme");
  }
};

if (storedTheme) {
  applyTheme(storedTheme);
} else if (prefersDark.matches) {
  applyTheme("dark");
}

themeToggle?.addEventListener("click", () => {
  const current = root.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem("theme", next);
});

prefersDark.addEventListener("change", (event) => {
  if (!localStorage.getItem("theme")) {
    applyTheme(event.matches ? "dark" : "light");
  }
});


document.querySelectorAll("a[href^='#']").forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const target = document.querySelector(targetId);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "auto", block: "start" });
    }
  });
});

document.querySelectorAll(".copy").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.getAttribute("data-copy") || "";
    const live = button.querySelector(".sr-only");
    let note = button.querySelector(".copy-note");
    if (!note) {
      note = document.createElement("span");
      note.className = "copy-note";
      button.appendChild(note);
    }
    try {
      await navigator.clipboard.writeText(value);
      if (live) {
        live.textContent = "Copied";
        setTimeout(() => {
          live.textContent = "";
        }, 1500);
      }
      note.textContent = "Copied";
      note.classList.add("show");
      setTimeout(() => {
        note.classList.remove("show");
      }, 1200);
    } catch {
      if (live) {
        live.textContent = "Copy failed";
        setTimeout(() => {
          live.textContent = "";
        }, 1500);
      }
      note.textContent = "Copy failed";
      note.classList.add("show");
      setTimeout(() => {
        note.classList.remove("show");
      }, 1200);
    }
  });
});

const timelineBlocks = document.querySelectorAll(".timeline");

const lineObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");
      }
    });
  },
  { threshold: 0.3 }
);

timelineBlocks.forEach((block) => lineObserver.observe(block));

document.querySelectorAll(".course").forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.toggle("active");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
);

document.querySelectorAll(".reveal-on-scroll").forEach((element) => {
  revealObserver.observe(element);
});

const sections = Array.from(document.querySelectorAll("main section"));
const navLinks = Array.from(document.querySelectorAll(".nav a"));

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.5 }
);

sections.forEach((section) => spyObserver.observe(section));
