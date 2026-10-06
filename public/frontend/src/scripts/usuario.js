const idade = document.getElementById("idade");
const altura = document.getElementById("altura");
const peso = document.getElementById("peso");
const objetivoHidratacao = document.getElementById("objetivo-hidratacao");
const objetivoPeso = document.getElementById("objetivo-peso");

(async () => {
  try {
    const caminho = window.location.pathname; // Retorna "/conta/usuario/45"
    const pedacos = caminho.split("/"); // Retorna ["", "conta", "usuario", "45"]

    const id = pedacos[3]; // "45"
    const response = await fetch(`/api/usuario/usuario/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      alert(`Erro na requisição: ${response.status}\n${response.body}`);
      throw new Error(
        `Erro na requisição: ${response.status}\n${response.body}`,
      );
    }

    idade.innerText = response.body.idade;
    altura.innerText = response.body.altura;
    peso.innerText = response.body.peso;
    objetivoHidratacao.innerText = response.body.objetivo_hidratacao;
    objetivoPeso.innerText = response.body.objetivo_peso;
  } catch (e) {
    console.error(`Erro ao processar dados do usuario: - ${e}`);
  }
})();
