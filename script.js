const nodes = document.querySelectorAll(".node[data-target]");

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
