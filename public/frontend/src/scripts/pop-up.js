let temPopUp = false;

function popUp(conteudo) {
  if (temPopUp == false) {
    const main = document.getElementById("main");
    const popUp = document.createElement("div");

    popUp.classList.add("pop-up");
    popUp.innerHTML = conteudo;

    const botaoFechar = document.createElement("img");
    botaoFechar.src = "/src/images/close.svg";

    botaoFechar.classList.add("pop-up-fechar");
    botaoFechar.id = "botao-fechar-pop-up";

    botaoFechar.addEventListener("click", function () {
      popUp.remove();
      temPopUp = false;
    });

    popUp.appendChild(botaoFechar);

    main.appendChild(popUp);
    console.log(popUp);
    temPopUp = true;
  }
}

function fecharPopUp(popUp) {
  popUp.classList.toggle("invisivel");
}
