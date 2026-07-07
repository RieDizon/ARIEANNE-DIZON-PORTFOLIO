const menuToggle = document.querySelector(".menu-toggle");
const sidebar = document.querySelector(".sidebar");
const overlay = document.querySelector(".overlay");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(".reveal");
const typingText = document.querySelector("#typing-text");
const form = document.querySelector(".contact-form");
const formStatus = document.querySelector(".form-status");

const phrases = [
  "Aspiring Data Scientist",
  "Database Enthusiast",
  "Computer Science Student",
  "Future Software Engineer",
];

let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function setMenu(open) {
  sidebar.classList.toggle("open", open);
  overlay.classList.toggle("show", open);
  menuToggle.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  sidebar.setAttribute("aria-hidden", String(!open));
  overlay.setAttribute("aria-hidden", String(!open));
}

setMenu(false);

menuToggle.addEventListener("click", () => {
  setMenu(!sidebar.classList.contains("open"));
});

overlay.addEventListener("click", () => setMenu(false));

navLinks.forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && sidebar.classList.contains("open")) {
    setMenu(false);
    menuToggle.focus();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 820 && sidebar.classList.contains("open")) {
    setMenu(false);
  }
});

function typeLoop() {
  const current = phrases[phraseIndex];
  typingText.textContent = current.slice(0, charIndex);

  if (!deleting && charIndex < current.length) {
    charIndex += 1;
    setTimeout(typeLoop, 80);
    return;
  }

  if (!deleting && charIndex === current.length) {
    deleting = true;
    setTimeout(typeLoop, 1200);
    return;
  }

  if (deleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(typeLoop, 42);
    return;
  }

  deleting = false;
  phraseIndex = (phraseIndex + 1) % phrases.length;
  setTimeout(typeLoop, 250);
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));

form.addEventListener("submit", (event) => {
  const formData = new FormData(form);
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const message = formData.get("message")?.toString().trim();

  if (!name || !email || !message) {
    event.preventDefault();
    formStatus.textContent = "Please complete all fields.";
    formStatus.className = "form-status error";
    return;
  }

  formStatus.textContent = "Sending your message...";
  formStatus.className = "form-status success";
});

typeLoop();
