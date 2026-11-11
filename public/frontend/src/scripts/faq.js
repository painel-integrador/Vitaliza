/* Muda o mais para menos, e da toggle no p */
function faq(card) {
  const menos = card.querySelector(".menos");
  const mais = card.querySelector(".mais");

  menos.classList.toggle("invisivel");
  mais.classList.toggle("invisivel");

  // remove o paragrafo
  card.querySelector("p").classList.toggle("invisivel");
}
