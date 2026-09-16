function faq(card) {
  card.classList.toggle("faq-aberto");

  const menos = card.querySelector(".menos");
  const mais = card.querySelector(".mais");

  menos.classList.toggle("invisivel");
  mais.classList.toggle("invisivel");

  // remove o paragrafo

  card.querySelector("p").classList.toggle("invisivel");
}
