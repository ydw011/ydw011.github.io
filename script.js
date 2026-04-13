const nodes = document.querySelectorAll(".node[data-target]");
const guestbookThread = document.querySelector("#guestbook-thread");

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

if (guestbookThread) {
  const utterancesScript = document.createElement("script");
  utterancesScript.src = "https://utteranc.es/client.js";
  utterancesScript.async = true;
  utterancesScript.crossOrigin = "anonymous";
  utterancesScript.setAttribute("repo", "ydw011/ydw011.github.io");
  utterancesScript.setAttribute("issue-term", "pathname");
  utterancesScript.setAttribute("label", "guestbook");
  utterancesScript.setAttribute("theme", "github-dark");

  guestbookThread.appendChild(utterancesScript);
}
