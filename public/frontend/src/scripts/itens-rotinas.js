const form = document.getElementById("form-rotina");
const containerExercicios = document.getElementById("container-exercicios");
const btnAddExercicio = document.getElementById("btn-add-exercicio");
const templateExercicio = document.getElementById("template-exercicio");

// Função para adicionar um novo bloco de exercício na tela
function adicionarBlocoExercicio() {
  // Clona o conteúdo do <template>
  const clone = templateExercicio.content.cloneNode(true);

  // Adiciona evento ao botão de remover deste bloco
  clone
    .querySelector(".btn-remover-exercicio")
    .addEventListener("click", (e) => {
      e.target.closest(".bloco-exercicio").remove();
    });

  containerExercicios.appendChild(clone);
}

// Adiciona um primeiro exercício automaticamente ao carregar a página
adicionarBlocoExercicio();

function atualizarTitulo(input) {
  // Sobe até o elemento pai (o bloco do exercício)
  const bloco = input.closest(".bloco-exercicio");

  // Procura o h3 dentro desse bloco específico
  const titulo = bloco.querySelector(".titulo-bloco-exercicio");

  // Se o input tiver valor, usa o valor. Se estiver vazio, volta ao padrão "Exercício"
  titulo.textContent = input.value.trim() !== "" ? input.value : "Exercício";
}

// Captura e formatação dos dados no Submit
form.addEventListener("submit", (event) => {
  event.preventDefault(); // Impede o recarregamento da página

  // 1. Pega os dados gerais da rotina
  const nomeRotina = document.getElementById("nome-rotina").value;

  // 2. Seleciona todos os blocos de exercícios inseridos no container
  const blocosExercicios =
    containerExercicios.querySelectorAll(".bloco-exercicio");
  const exerciciosDados = [];

  // 3. Percorre cada bloco e extrai os valores dos inputs
  blocosExercicios.forEach((bloco) => {
    const nome = bloco.querySelector(".input-nome-exercicio").value;
    const series = Number(bloco.querySelector(".input-series-exercicio").value);
    const midiaRaw = bloco.querySelector(".input-midia-exercicio").value;

    // Transforma a string de URLs em um Array limpando espaços em branco
    const midia = midiaRaw
      ? midiaRaw
          .split(",")
          .map((url) => url.trim())
          .filter((url) => url !== "")
      : [];

    exerciciosDados.push({
      nome,
      series,
      midia,
    });
  });

  // 4. Cria o objeto final na estrutura desejada
  const payloadFinal = {
    rotinaDados: {
      nome: nomeRotina,
    },
    exerciciosDados: exerciciosDados,
  };

  console.log("Objeto pronto para envio:", payloadFinal);

  // Aqui você faria o fetch() enviando payloadFinal para o seu backend
});
