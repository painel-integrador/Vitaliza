document.querySelectorAll(".drop-hover").forEach((dropdown) => {
  const drop = dropdown.querySelector(":scope > a, :scope > button");

  if (!drop) {
    return;
  }

  drop.addEventListener("click", (event) => {
    event.preventDefault();
    dropdown.classList.toggle("drop-aberto");
    drop.setAttribute(String(dropdown.classList.contains("drop-aberto")));
  });
});
