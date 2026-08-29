let isMenuAberto = false;

console.log("Script carregado");

function menu() {
  let botaoMenu = document.getElementById("botao-menu");
  let botaoFechar = document.getElementById("botao-fechar");
  let nav = document.getElementById("nav");

  // Menu fechado vai abrir

  if (!isMenuAberto) {
    botaoMenu.classList.add("invisivel");
    botaoMenu.classList.remove("visivel");

    botaoFechar.classList.add("visivel");
    botaoFechar.classList.remove("invisivel");

    nav.classList.add("visivel");
    nav.classList.remove("invisivel");

    console.log("Hello 1");
  } /* Fechar Menu */ else {
    botaoMenu.classList.add("visivel");
    botaoMenu.classList.remove("invisivel");

    botaoFechar.classList.add("invisivel");
    botaoFechar.classList.remove("visivel");

    nav.classList.add("invisivel");
    nav.classList.remove("visivel");

    console.log("Hello 2");
  }

  isMenuAberto = !isMenuAberto;
}
