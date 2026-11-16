let isMenuAberto = false;
let botaoMenu = document.getElementById("menu-hamburguer");
let botaoFechar = document.getElementById("menu-fechar");
let menuMobile = document.getElementById("menu-mobile");
let cabecalho = document.querySelector("header");
let html = document.documentElement;
let temaSalvo = localStorage.getItem("tema");

if (temaSalvo === "light" || temaSalvo === "dark") {
  html.dataset.theme = temaSalvo;
} else {
  html.dataset.theme = "light";
}

document.querySelectorAll("[data-theme-toggle]").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    html.dataset.theme = html.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("tema", html.dataset.theme);
  });
});

function menu() {
  // Menu fechado vai abrir
  botaoMenu.classList.toggle("invisivel");

  botaoFechar.classList.toggle("invisivel");

  menuMobile.classList.toggle("invisivel");

  isMenuAberto = !menuMobile.classList.contains("invisivel");
  cabecalho.classList.toggle("menu-aberto", isMenuAberto);
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

async function sair() {
  try {
    const response = await fetch("/api/auth/sair", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    // Se o backend respondeu com redirect (302), a propriedade .url conterá o destino final
    if (response.redirected) {
      window.location.href = response.url;
    }
  } catch (e) {
    console.error("Erro ao processar logout:", e);
  }
}
