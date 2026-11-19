document.querySelectorAll(".drop-hover").forEach((dropdown) => {
  const trigger = dropdown.querySelector(":scope > a, :scope > button");

  if (!trigger) {
    return;
  }

  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    dropdown.classList.toggle("drop-aberto");
    trigger.setAttribute(String(dropdown.classList.contains("drop-aberto")));
  });
});
