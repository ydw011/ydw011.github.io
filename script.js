const root = document.documentElement;
const header = document.querySelector(".site-header");
const themeToggle = document.querySelector(".theme-toggle");
const publicationList = document.querySelector("#publication-list");
const publicationCount = document.querySelector("#publication-count");
const projectList = document.querySelector("#project-list");
const educationList = document.querySelector("#education-list");
const careerList = document.querySelector("#career-list");
const talkThread = document.querySelector("#talk-thread");

const OWNER_NAME_PATTERN = /Dong[\s-]?Wook\s+Yang/gi;

/* ---------- Theme ---------- */

function currentTheme() {
  return root.dataset.theme === "light" ? "light" : "dark";
}

themeToggle?.addEventListener("click", () => {
  const nextTheme = currentTheme() === "light" ? "dark" : "light";
  root.dataset.theme = nextTheme;

  try {
    localStorage.setItem("theme", nextTheme);
  } catch (error) {}

  const utterancesFrame = document.querySelector(".utterances-frame");
  utterancesFrame?.contentWindow?.postMessage(
    { type: "set-theme", theme: utterancesTheme() },
    "https://utteranc.es"
  );
});

/* ---------- Header + active section ---------- */

const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);

  // The active section is the last one whose top has passed 40% of the viewport.
  const marker = window.scrollY + window.innerHeight * 0.4;
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
  let activeId = "";

  sections.forEach((section) => {
    if (section.offsetTop <= marker) {
      activeId = section.id;
    }
  });

  if (atBottom && sections.length > 0) {
    activeId = sections[sections.length - 1].id;
  }

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${activeId}`);
  });
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", updateHeader);

/* ---------- Reveal on scroll ---------- */

// Checked on scroll rather than with IntersectionObserver so content can never stay hidden.
const pendingReveals = new Set();

function revealInView() {
  const threshold = window.innerHeight * 0.92;

  pendingReveals.forEach((element) => {
    if (element.getBoundingClientRect().top < threshold) {
      element.classList.add("is-visible");
      pendingReveals.delete(element);
    }
  });
}

function observeReveal(elements) {
  elements.forEach((element, index) => {
    if (element.closest(".hero")) {
      element.style.setProperty("--reveal-delay", `${index * 0.08}s`);
    }

    pendingReveals.add(element);
  });

  requestAnimationFrame(revealInView);
  window.setTimeout(revealInView, 100);
}

observeReveal(document.querySelectorAll(".reveal"));
window.addEventListener("scroll", revealInView, { passive: true });
window.addEventListener("resize", revealInView);

/* ---------- Copy email ---------- */

document.querySelectorAll(".copy-btn").forEach((button) => {
  const label = button.querySelector(".copy-label");

  button.addEventListener("click", async () => {
    const address = `${button.dataset.user}@${button.dataset.domain}`;

    try {
      await navigator.clipboard.writeText(address);
    } catch (error) {
      window.location.href = `mailto:${address}`;
      return;
    }

    button.classList.add("is-copied");
    if (label) label.textContent = "Copied";

    window.setTimeout(() => {
      button.classList.remove("is-copied");
      if (label) label.textContent = "Copy";
    }, 1800);
  });
});

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

/* ---------- Content from JSON ---------- */

async function loadJson(path) {
  const response = await fetch(path, { cache: "no-cache" });

  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }

  return response.json();
}

if (publicationList) {
  loadJson("publications.json")
    .then((publications) => {
      if (!Array.isArray(publications) || publications.length === 0) {
        publicationList.innerHTML = `<li class="state-message">Publications will appear here soon.</li>`;
        return;
      }

      if (publicationCount) {
        publicationCount.textContent = publications.length;
      }

      publicationList.innerHTML = publications
        .slice()
        .sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0))
        .map(renderPublication)
        .join("");

      observeReveal(publicationList.querySelectorAll(".reveal"));
    })
    .catch(() => {
      publicationList.innerHTML = `<li class="state-message">Publication data could not be loaded. Open the site through GitHub Pages or a local server.</li>`;
    });
}

function renderPublication(publication) {
  const title = escapeHtml(publication.title || "Untitled publication");
  const authors = escapeHtml(publication.authors || "").replace(
    OWNER_NAME_PATTERN,
    (name) => `<strong>${name}</strong>`
  );
  const venue = escapeHtml(publication.venue || "");
  const year = escapeHtml(publication.year || "");
  const link = safeUrl(publication.link);
  const isLead = /lead|first/i.test(publication.role || "");

  const tags = [
    publication.role ? `<span class="tag${isLead ? " tag-accent" : ""}">${escapeHtml(publication.role)}</span>` : "",
    publication.scope ? `<span class="tag">${escapeHtml(publication.scope)}</span>` : "",
  ].join("");

  const titleMarkup = link
    ? `<a href="${escapeHtml(link)}" target="_blank" rel="noreferrer">${title}</a>`
    : title;

  const linkButton = link
    ? `<a class="icon-btn" href="${escapeHtml(link)}" target="_blank" rel="noreferrer" aria-label="Open paper: ${title}">
        <svg class="icon" aria-hidden="true"><use href="#i-arrow"></use></svg>
      </a>`
    : "<span></span>";

  return `
    <li class="pub reveal">
      <span class="pub-year">${year}</span>
      <div>
        <h4 class="pub-title">${titleMarkup}</h4>
        <p class="pub-authors">${authors}</p>
        <p class="pub-meta">${venue ? `<span class="pub-venue">${venue}</span>` : ""}${tags}</p>
      </div>
      ${linkButton}
    </li>
  `;
}

if (projectList) {
  loadJson("projectslist.json")
    .then((projects) => {
      if (!Array.isArray(projects) || projects.length === 0) {
        projectList.innerHTML = renderProjectsEmpty();
      } else {
        projectList.innerHTML = projects.map(renderProject).join("");
      }

      observeReveal(projectList.querySelectorAll(".reveal"));
    })
    .catch(() => {
      projectList.innerHTML = renderProjectsEmpty();
      observeReveal(projectList.querySelectorAll(".reveal"));
    });
}

function renderProject(project) {
  const title = escapeHtml(project.title || "Untitled project");
  const period = escapeHtml(project.period || "");
  const summary = escapeHtml(project.summary || "");
  const link = safeUrl(project.link);
  const image = safeUrl(project.image);
  const tags = Array.isArray(project.tags)
    ? project.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")
    : "";

  const body = `
    ${image ? `<img class="project-media" src="${escapeHtml(image)}" alt="" loading="lazy">` : ""}
    <div class="project-body">
      ${period ? `<span class="project-period">${period}</span>` : ""}
      <h3>${title}</h3>
      ${summary ? `<p>${summary}</p>` : ""}
      ${tags ? `<div class="project-tags">${tags}</div>` : ""}
    </div>
  `;

  return link
    ? `<a class="project-card reveal" href="${escapeHtml(link)}" target="_blank" rel="noreferrer">${body}</a>`
    : `<article class="project-card reveal">${body}</article>`;
}

function renderProjectsEmpty() {
  return `
    <div class="empty-state reveal">
      <span class="empty-orbit" aria-hidden="true"></span>
      <div class="empty-text">
        <h3>Write-ups in preparation</h3>
        <p>Project pages are on their way. In the meantime, take a look at my repositories on GitHub.</p>
      </div>
      <a class="btn btn-ghost" href="https://github.com/ydw011" target="_blank" rel="noreferrer">
        <svg class="icon" aria-hidden="true"><use href="#i-github"></use></svg>GitHub
      </a>
    </div>
  `;
}

if (educationList || careerList) {
  loadJson("aboutinfo.json")
    .then((aboutInfo) => {
      renderTimeline(educationList, aboutInfo.education);
      renderTimeline(careerList, aboutInfo.career);
    })
    .catch(() => {
      [educationList, careerList].forEach((list) => {
        if (list) list.innerHTML = `<li class="state-message">Could not be loaded.</li>`;
      });
    });
}

function renderTimeline(list, entries) {
  if (!list) {
    return;
  }

  const items = Array.isArray(entries) ? entries.filter((entry) => entry && entry.title) : [];

  if (items.length === 0) {
    list.closest(".reveal")?.setAttribute("hidden", "");
    return;
  }

  list.innerHTML = items
    .map(
      (entry) => `
        <li>
          <span class="timeline-period">${escapeHtml(entry.period || "")}</span>
          <span>
            <span class="timeline-title">${escapeHtml(entry.title)}</span>
            ${entry.org ? `<span class="timeline-org">${escapeHtml(entry.org)}</span>` : ""}
          </span>
        </li>
      `
    )
    .join("");
}

/* ---------- Guestbook (talk.html) ---------- */

function utterancesTheme() {
  return currentTheme() === "light" ? "github-light" : "github-dark";
}

if (talkThread) {
  const utterances = document.createElement("script");
  utterances.src = "https://utteranc.es/client.js";
  utterances.async = true;
  utterances.crossOrigin = "anonymous";
  utterances.setAttribute("repo", "ydw011/ydw011.github.io");
  utterances.setAttribute("issue-term", "pathname");
  utterances.setAttribute("label", "guestbook");
  utterances.setAttribute("theme", utterancesTheme());
  talkThread.appendChild(utterances);
}

// Only http(s) URLs (absolute or relative to this site) are allowed, so a link like
// "javascript:..." in the JSON files can never run code when clicked.
function safeUrl(value) {
  if (typeof value !== "string" || value.trim() === "") {
    return "";
  }

  try {
    const url = new URL(value.trim(), window.location.href);
    return url.protocol === "https:" || url.protocol === "http:" ? value.trim() : "";
  } catch (error) {
    return "";
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
