let isMenuAberto = false;
let botaoMenu = document.getElementById("botao-menu");
let botaoFechar = document.getElementById("botao-fechar");
let nav = document.getElementById("nav");
let btns = document.getElementById("btns");

function menu() {
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

// Menu com conta logada

if (document.cookie.includes("refresh_token=")) {
  // esconder os botoes
  btns.querySelectorAll("a").forEach((element) => {
    element.classList.add("invisivel");
  });

  console.table(btns);

  // mostrar itens do nav
  nav.querySelectorAll(".invisivel").forEach((element) => {
    element.classList.remove("invisivel");
  });
}
