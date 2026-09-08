function faq(elemento) {
  const card = elemento.parentElement;

  card.classList.toggle("faq-aberto");

  const menos = card.getElementByClassName("menos");
  const mais = card.getElementByClassName("mais");

  menos.classList.toggle("invisivel")
  mais.classList.toggle("invisivel")
}
