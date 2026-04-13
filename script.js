const nodes = document.querySelectorAll(".node[data-target]");
const guestbookForm = document.querySelector("#guestbook-form");
const guestbookList = document.querySelector("#guestbook-list");
const guestbookStatus = document.querySelector("#guestbook-status");
const guestbookClear = document.querySelector("#guestbook-clear");
const storageKey = "dw-portfolio-guestbook";
const guestbookAdminPassword = "20255225";

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

function loadGuestbookEntries() {
  try {
    const raw = window.localStorage.getItem(storageKey);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveGuestbookEntries(entries) {
  window.localStorage.setItem(storageKey, JSON.stringify(entries));
}

function renderGuestbookEntries() {
  if (!guestbookList) {
    return;
  }

  const entries = loadGuestbookEntries();

  if (entries.length === 0) {
    guestbookList.innerHTML = '<p class="guestbook-empty">No notes yet. Be the first visitor to leave one.</p>';
    return;
  }

  guestbookList.innerHTML = entries
    .map((entry) => {
      return `
        <article class="guestbook-entry">
          <div class="guestbook-entry-head">
            <span class="guestbook-entry-name">${escapeHtml(entry.name)}</span>
            <span class="guestbook-entry-date">${escapeHtml(entry.date)}</span>
          </div>
          <p class="guestbook-entry-message">${escapeHtml(entry.message)}</p>
        </article>
      `;
    })
    .join("");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

if (guestbookForm && guestbookList && guestbookStatus && guestbookClear) {
  renderGuestbookEntries();

  guestbookForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(guestbookForm);
    const name = String(formData.get("name") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !message) {
      guestbookStatus.textContent = "Please fill in both fields.";
      return;
    }

    const entries = loadGuestbookEntries();
    const nextEntry = {
      name,
      message,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    };

    const updatedEntries = [nextEntry, ...entries].slice(0, 6);
    saveGuestbookEntries(updatedEntries);
    renderGuestbookEntries();
    guestbookForm.reset();
    guestbookStatus.textContent = "Your note was added on this device.";
  });

  guestbookClear.addEventListener("click", () => {
    const enteredPassword = window.prompt("Enter admin password to clear notes.");

    if (enteredPassword === null) {
      guestbookStatus.textContent = "Clear action was cancelled.";
      return;
    }

    if (enteredPassword !== guestbookAdminPassword) {
      guestbookStatus.textContent = "Incorrect password. Notes were not cleared.";
      return;
    }

    window.localStorage.removeItem(storageKey);
    renderGuestbookEntries();
    guestbookStatus.textContent = "Local notes were cleared.";
  });
}
