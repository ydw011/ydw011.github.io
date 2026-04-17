const ASSET_VERSION = "32";

const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = `styles.css?v=${ASSET_VERSION}`;
document.head.appendChild(styleLink);

const currentPage = window.location.pathname.split("/").pop() || "index.html";
const pagesWithAppScript = new Set(["", "index.html", "research.html", "projects.html"]);

if (pagesWithAppScript.has(currentPage)) {
  const appScript = document.createElement("script");
  appScript.src = `script.js?v=${ASSET_VERSION}`;
  appScript.defer = true;
  document.head.appendChild(appScript);
}
