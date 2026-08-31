let isMenuAberto = false;

function menu() {
  let botaoMenu = document.getElementById("botao-menu");
  let botaoFechar = document.getElementById("botao-fechar");
  let nav = document.getElementById("nav");

  // Menu fechado vai abrir

  if (!isMenuAberto) {
    botaoMenu.classList.toggle("invisivel");

    botaoFechar.classList.toggle("invisivel");

    nav.classList.add("menu-aberto");
    nav.classList.remove("menu-fechado");
  } /* Fechar Menu */ else {
    botaoMenu.classList.toggle("invisivel");

    botaoFechar.classList.toggle("invisivel");

    nav.classList.add("menu-fechado");
    nav.classList.remove("menu-aberto");
  }

  isMenuAberto = !isMenuAberto; // troca o valor boolean (true => false | false => true)
}
