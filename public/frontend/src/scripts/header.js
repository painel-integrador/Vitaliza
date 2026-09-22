let isMenuAberto = false;
let botaoMenu = document.getElementById("botao-menu");
let botaoFechar = document.getElementById("botao-fechar");
let nav = document.getElementById("nav");
let btns = document.getElementById("btns");

// Fechado para celulares
if (window.matchMedia("(max-width: 600px)").matches) {
  nav.classList.add("menu-fechado");
}

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

async function checarAutenticacao() {
  try {
    const response = await fetch("/api/auth/me");
    if (response.ok) {
      // 1. Oculta o contêiner de botões de login/criar conta
      if (btns) {
        btns.classList.add("invisivel");
      }

      // 2. Remove a classe 'invisivel' apenas dos links dentro da navegação
      const linksInvisiveis = nav.querySelectorAll("nav.menu a.invisivel");
      linksInvisiveis.forEach((element) => {
        element.classList.remove("invisivel");
      });
    }
  } catch (erro) {
    console.error("Usuário não autenticado ou erro na API", erro);
  }
}

checarAutenticacao();
