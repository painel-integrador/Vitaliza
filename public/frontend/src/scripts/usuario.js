const nome = document.getElementById("nome");
const idade = document.getElementById("idade");
const altura = document.getElementById("altura");
const peso = document.getElementById("peso");
const objetivoHidratacao = document.getElementById("objetivo-hidratacao");
const objetivoPeso = document.getElementById("objetivo-peso");

const carregarDadosUsuario = async () => {
  try {
    const caminho = window.location.pathname; // Ex: "/conta/usuario/45" ou "/conta/usuario/me"
    const pedacos = caminho.split("/");
    let id = pedacos[pedacos.length - 1]; // Pega a última parte da URL

    // Se a URL for /conta/usuario/me, busca primeiro o ID do usuário logado
    if (id === "me") {
      const respId = await fetch("/api/usuario/id", { method: "GET" });
      if (!respId.ok) {
        throw new Error(`Erro ao buscar ID do usuário: ${respId.status}`);
      }
      const dadosId = await respId.json();
      id = dadosId.usuario_id;
    }

    // Busca os dados do usuário com o ID (obtido da URL ou da rota /id)
    const response = await fetch(`/api/usuario/usuario/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      alert(`Erro na requisição: ${response.status}`);
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const usuario = await response.json();

    // Preenche os elementos do HTML
    if (nome) nome.innerText = usuario.nome || "Não informado";
    if (idade)
      idade.innerText = usuario.idade
        ? `${usuario.idade} anos`
        : "Não informado";
    if (altura)
      altura.innerText = usuario.altura
        ? `${usuario.altura} cm`
        : "Não informado";
    if (peso)
      peso.innerText = usuario.peso
        ? `${usuario.peso / 1000} kg`
        : "Não informado";
    if (objetivoHidratacao) {
      objetivoHidratacao.innerText = usuario.objetivo_hidratacao
        ? `${usuario.objetivo_hidratacao} ml`
        : "Não informado";
    }
    if (objetivoPeso) {
      objetivoPeso.innerText = usuario.objetivo_peso
        ? `${usuario.objetivo_peso / 1000} kg`
        : "Não informado";
    }
  } catch (e) {
    console.error(`Erro ao processar dados do usuário: ${e}`);
  }
};

carregarDadosUsuario();
