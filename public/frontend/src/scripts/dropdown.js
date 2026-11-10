document.querySelectorAll(".drop-hover").forEach((dropdown) => {
  const trigger = dropdown.querySelector(":scope > a");

  if (!trigger) {
    return;
  }

  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    dropdown.classList.toggle("drop-aberto");
    trigger.setAttribute(
      "aria-expanded",
      dropdown.classList.contains("drop-aberto"),
    );
  });
});
