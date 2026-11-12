const tamanhoQuadrado = 20; // valor igual ao tamanho definido no CSS para o quadrado do background
const coresQuadrados = [
  "var(--secondary-80)",
  "var(--tertiary-80)",
  "var(--secondary-60)",
  "var(--tertiary-60)",
  "var(--secondary-40)",
  "var(--tertiary-40)",
  "var(--secondary-90)",
  "var(--tertiary-90)",
];

document.querySelectorAll(".bg-quadrados").forEach((grid) => {
  let ultimoQuadrado;

  // sempre que o mouse se move executa a função que cria o quadrado
  grid.addEventListener("pointermove", (event) => {
    const limite = grid.getBoundingClientRect(); // verifica onde o grid está na tela

    // calcula a posição do mouse em relação ao grid
    // por exemplo, se o grid está a 100px depois do inicio da página (depois do banner por exemplo),
    // ele precisa subtrair 100px da posição do mouse para saber onde ele está em relação ao grid
    // com a posição ele sabe onde vai ficar o quadrado
    const x = event.clientX - limite.left;
    const y = event.clientY - limite.top;

    // arredonda a posição para o quadrado mais próximo,
    // como os quadrados são de 20 em 20, ele arredonda para baixo para o quadrado mais próximo
    const quadradoX = Math.floor(x / tamanhoQuadrado) * tamanhoQuadrado;
    const quadradoY = Math.floor(y / tamanhoQuadrado) * tamanhoQuadrado;

    // cria uma string com a posição do quadrado atual, para comparar com o último quadrado criado
    // por exemplo: quadradoX:quadradoY = 3:3 = quadrado na terceira linha e terceira coluna
    const quadradoAtual = `${quadradoX}:${quadradoY}`;

    // caso o mouse ainda esteja no mesmo quadrado, não cria um novo quadrado
    if (quadradoAtual === ultimoQuadrado) {
      return;
    }

    ultimoQuadrado = quadradoAtual;

    // cria o elemento do quadrado, adiciona a classe e define as variáveis CSS para a posição e cor
    const quadrado = document.createElement("span");
    quadrado.className = "hover-square";
    quadrado.style.setProperty("--square-x", `${quadradoX}px`); // o '--' siginifica variavel
    quadrado.style.setProperty("--square-y", `${quadradoY}px`);
    quadrado.style.setProperty(
      "--square-color",
      coresQuadrados[
        Math.floor(
          // o floor serve para quando o valor calculado for algo como 3,6, então vira 3
          Math.random() /* cria um aleatoria entre 0 e 1 */ *
            coresQuadrados.length /* multiplica pelo tamanho de cores: 8, com isso ele sabe a cor para escolher, por exemplo,
             se o valor foi 0.5, vai ser 8 * 0.5 = 4 */,
        )
      ],
    );

    // o quadrado vem com um keyframe, quando acaba a animação, ele é removido
    quadrado.addEventListener("animationend", () => quadrado.remove(), {
      once: true, // once true é usado para que o evento seja executado apenas uma vez, caso contrário, ele ficaria escutando o evento e poderia dar erro
    });

    grid.append(quadrado);
  });
});
