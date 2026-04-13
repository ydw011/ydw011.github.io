const nodes = document.querySelectorAll(".node[data-target]");
const centerNode = document.querySelector(".center-node[data-easter-egg]");
const mindmapStage = document.querySelector(".mindmap-stage");
const shakeNodes = document.querySelectorAll(".mindmap .node:not(.center-node)");
const centerNodeMeta = centerNode?.querySelector(".node-meta");
const rocketEasterEgg = document.querySelector("#rocket-easter-egg");
const publicationList = document.querySelector("#publication-list");
const projectList = document.querySelector("#project-list");

nodes.forEach((node) => {
  node.addEventListener("click", () => {
    const target = node.dataset.target;

    if (!target) {
      return;
    }

    node.classList.add("is-activating");

    window.setTimeout(() => {
      window.location.href = target;
    }, 260);
  });
});

if (centerNode && mindmapStage && shakeNodes.length > 0) {
  centerNode.addEventListener("click", () => {
    if (mindmapStage.classList.contains("is-orbiting")) {
      return;
    }

    const originalMeta = centerNodeMeta?.textContent;
    centerNode.classList.add("is-sparking");
    mindmapStage.classList.add("is-orbiting");
    shakeNodes.forEach((node) => node.classList.add("is-shaking"));
    rocketEasterEgg?.classList.add("is-launching");
    if (centerNodeMeta) {
      centerNodeMeta.textContent = "Magnificent desolation! - Buzz Aldrin";
    }

    window.setTimeout(() => {
      centerNode.classList.remove("is-sparking");
      mindmapStage.classList.remove("is-orbiting");
      shakeNodes.forEach((node) => node.classList.remove("is-shaking"));
      rocketEasterEgg?.classList.remove("is-launching");
      if (centerNodeMeta && originalMeta) {
        centerNodeMeta.textContent = originalMeta;
      }
    }, 1400);
  });
}

if (publicationList) {
  fetch("publications.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load publication data.");
      }

      return response.json();
    })
    .then((publications) => {
      if (!Array.isArray(publications) || publications.length === 0) {
        publicationList.innerHTML = `
          <article class="publication-card">
            <p class="publication-status">No Publications Yet</p>
            <h3>Add your first paper in publications.json</h3>
            <p class="publication-summary">This list will update automatically when you add publication objects to the data file.</p>
          </article>
        `;
        return;
      }

      publicationList.innerHTML = publications
        .map((publication) => {
          const status = escapeHtml(publication.status || "Publication");
          const title = escapeHtml(publication.title || "Untitled publication");
          const meta = escapeHtml(publication.meta || "");
          const summary = escapeHtml(publication.summary || "");
          const link = typeof publication.link === "string" ? publication.link.trim() : "";
          const safeLink = escapeAttribute(link);
          const linkButton = link
            ? `
              <a class="publication-file-link" href="${safeLink}" target="_blank" rel="noreferrer" aria-label="Open paper file for ${title}">
                <img class="publication-file-icon" src="image/file.png" alt="">
              </a>
            `
            : "";

          return `
            <article class="publication-card">
              <div class="publication-head">
                <div class="publication-heading-text">
                  <p class="publication-status">${status}</p>
                  <h3>${title}</h3>
                </div>
                ${linkButton}
              </div>
              <p class="publication-meta">${meta}</p>
              <p class="publication-summary">${summary}</p>
            </article>
          `;
        })
        .join("");
    })
    .catch(() => {
      publicationList.innerHTML = `
        <article class="publication-card">
          <p class="publication-status">Load Error</p>
          <h3>Publication data could not be loaded</h3>
          <p class="publication-summary">Check publications.json and make sure the site is opened through GitHub Pages or a local server.</p>
        </article>
      `;
    });
}

if (projectList) {
  fetch("projectslist.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load project data.");
      }

      return response.json();
    })
    .then((projects) => {
      if (!Array.isArray(projects) || projects.length === 0) {
        projectList.innerHTML = `
          <article class="publication-card">
            <p class="publication-status">No Projects Yet</p>
            <h3>Add your first project in projectslist.json</h3>
            <p class="publication-summary">This list will update automatically when you add project objects to the data file.</p>
          </article>
        `;
        return;
      }

      projectList.innerHTML = projects
        .map((project) => {
          const status = escapeHtml(project.status || "Project");
          const title = escapeHtml(project.title || "Untitled project");
          const meta = escapeHtml(project.meta || "");
          const summary = escapeHtml(project.summary || "");

          return `
            <article class="publication-card">
              <p class="publication-status">${status}</p>
              <h3>${title}</h3>
              <p class="publication-meta">${meta}</p>
              <p class="publication-summary">${summary}</p>
            </article>
          `;
        })
        .join("");
    })
    .catch(() => {
      projectList.innerHTML = `
        <article class="publication-card">
          <p class="publication-status">Load Error</p>
          <h3>Project data could not be loaded</h3>
          <p class="publication-summary">Check projectslist.json and make sure the site is opened through GitHub Pages or a local server.</p>
        </article>
      `;
    });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
