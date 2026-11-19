gsap.registerPlugin(Draggable);
gsap.registerPlugin(InertiaPlugin);

let modoAtivo = null;
let draggablesAtivos = [];

document.querySelectorAll(".fun").forEach((elemento) => {
  elemento.addEventListener("click", () => {
    if (modoAtivo !== "apagavel") {
      return;
    }

    if (!elemento.classList.contains("apagado-1")) {
      elemento.classList.add("apagado-1");
    } else if (!elemento.classList.contains("apagado-2")) {
      elemento.classList.add("apagado-2");
    }
  });
});

function destruirDraggables() {
  draggablesAtivos.forEach((draggable) => draggable.kill());
  draggablesAtivos = [];

  document.querySelectorAll(".fun").forEach((elemento) => {
    elemento.classList.remove("movel", "giravel", "apagavel");
  });

  document
    .querySelectorAll(
      ".btn-fun-bar-1, .btn-fun-bar-2, .btn-fun-bar-3, .btn-fun-bar-4, .btn-fun-bar-5",
    )
    .forEach((botao) => botao.classList.remove("active"));
}

function selecionarModo(modo, botao) {
  // quando clica no mesmo botão, desativa o modo
  if (modoAtivo === modo) {
    destruirDraggables();
    modoAtivo = null;
    return;
  }

  // desativa o modo anterior
  destruirDraggables();
  modoAtivo = modo;

  document.querySelectorAll(".fun").forEach((elemento) => {
    elemento.classList.add(modo);
  });

  if (modo === "movel") {
    draggablesAtivos = Draggable.create(".fun", {
      type: "x,y",
      inertia: true,
      bounds: "main",
    });
  } else if (modo === "giravel") {
    draggablesAtivos = Draggable.create(".fun", {
      type: "rotation",
      inertia: true,
    });
  } else if (modo === "apagavel") {
    document.querySelectorAll(".fun").forEach((elemento) => {
      elemento.classList.add("apagavel");
    });
  }

  const classeBotao = {
    movel: ".btn-fun-bar-3",
    giravel: ".btn-fun-bar-4",
    apagavel: ".btn-fun-bar-1",
  }[modo]; // usa o objeto para mapear o modo para a classe do botão correspondente
  // o modo é um dos valores: "movel", "giravel", "apagavel"
  // no caso uma string

  document.querySelectorAll(classeBotao).forEach((botaoModo) => {
    botaoModo.classList.add("active");
  });
}

function movel(botao) {
  selecionarModo("movel", botao);
}

function giravel(botao) {
  selecionarModo("giravel", botao);
}

function apagavel(botao) {
  selecionarModo("apagavel", botao);
}
