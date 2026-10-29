import repository from "./db.js";

export const contasRepository = new repository("contas");

export async function criarConta(dados) {
  return contasRepository.criar({
    dados,
    dadosResposta: "*",
  });
}

export async function buscarContaPorEmail(email) {
  return contasRepository.procurarUm({
    coluna: "email",
    dado: email,
    dadosResposta: "*",
  });
}

export async function buscarContaPorId(contaId) {
  return contasRepository.procurarUm({
    coluna: "id",
    dado: contaId,
    dadosResposta: "id,usuario_id,conexao_google_id,email",
  });
}

/* Adiciona o id da linha da tabela de conexões com o Google, à linha da tabela de contas */
export async function conectarGoogleNaConta(contaId, conexaoGoogleId) {
  return contasRepository.atualizar({
    colunaAtualizar: "conexao_google_id",
    dadoAtualizar: conexaoGoogleId,
    colunaFiltrar: "id",
    dadoFiltrar: contaId,
    dadosResposta: "*",
  });
}

export async function conectarUsuarioNaConta(contaId, usuarioId) {
  return contasRepository.atualizar({
    colunaAtualizar: "usuario_id",
    dadoAtualizar: usuarioId,
    colunaFiltrar: "id",
    dadoFiltrar: contaId,
    dadosResposta: "*",
  });
}
