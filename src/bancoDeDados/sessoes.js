import repository from "./db.js";

export const sessoesRepository = new repository("sessoes");

export async function criarSessao(dados) {
  return sessoesRepository.criar({
    dados,
    dadosResposta: "*",
  });
}

export async function buscarSessaoPorToken(accessToken) {
  return sessoesRepository.procurarUm({
    coluna: "access_token",
    dado: accessToken,
    dadosResposta: "*",
  });
}

export async function atualizarTokens(
  sessionId,
  accessToken,
  refreshToken,
  expiraEmDuasHoras,
  expiraEmDoisMeses,
) {
  return sessoesRepository.atualizarTudo({
    dadosAtualizar: {
      access_token: accessToken,
      refresh_token: refreshToken,
      access_token_expira_em: expiraEmDuasHoras,
      refresh_token_expira_em: expiraEmDoisMeses,
    },
    colunaFiltrar: "id",
    dadoFiltrar: sessionId,
    dadosResposta: "*",
  });
}

export async function deletarSessao(accessToken) {
  await sessoesRepository.deletar({
    coluna: "access_token",
    dado: accessToken,
  });
}
