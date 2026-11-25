const nome = document.getElementById("nome");
const idade = document.getElementById("idade");
const altura = document.getElementById("altura");
const peso = document.getElementById("peso");
const avatar = document.getElementById("avatar");
const criadoEm = document.getElementById("criado-em");

const nãoInformado = "Não informado";

const formatarData = (valor) => {
  if (!valor) return nãoInformado;

  const data = new Date(valor);
  if (isNaN(data)) return nãoInformado;

  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Preenche o HTML a partir de um objeto usuário (usado pela API e pelo mock)
const preencherPerfil = (usuario) => {
  nome.innerText = usuario.nome || nãoInformado;

  avatar.src = usuario.avatar
    ? `src/assets/images/avatar/${usuario.avatar}.svg`
    : "src/assets/images/avatar/0.jpg";

  idade.innerText = usuario.idade ? `${usuario.idade} anos` : nãoInformado;
  altura.innerText = usuario.altura ? `${usuario.altura} cm` : nãoInformado;
  peso.innerText = usuario.peso ? `${usuario.peso / 1000} kg` : nãoInformado;
  criadoEm.innerText = formatarData(usuario.criado_em);
};

// Se o último pedaço da URL for um número, é o id. Senão (vazio, "me", "usuario"...), é "me".
const obterIdDaUrl = () => {
  const pedacos = window.location.pathname.split("/").filter(Boolean);
  const ultimo = pedacos[pedacos.length - 1];
  return /^\d+$/.test(ultimo) ? ultimo : "me";
};

const carregarDadosUsuario = async () => {
  try {
    let id = obterIdDaUrl();

    // Se for "me", busca primeiro o id do usuário logado
    if (id === "me") {
      const respId = await fetch("/api/usuario/me", { method: "GET" });
      if (!respId.ok) {
        throw new Error(`Erro ao buscar ID do usuário: ${respId.status}`);
      }
      const dadosId = await respId.json();
      id = dadosId.usuario_id;
    }

    const response = await fetch(`/api/usuario/usuario/${id}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const usuario = await response.json();
    preencherPerfil(usuario);
  } catch (e) {
    console.error(`Erro ao processar dados do usuário: ${e}`);
    alert("Não foi possível carregar os dados do usuário.");
  }
};

// Versão de teste
const carregarDadosUsuario2 = () => {
  preencherPerfil({
    nome: "Exemplo",
    avatar: 5,
    altura: 168,
    idade: 23,
    peso: 78000,
    criado_em: Date.now(),
  });
};

carregarDadosUsuario();
