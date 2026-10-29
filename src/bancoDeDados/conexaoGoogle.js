import repository from "./db.js";

export const googleRepository = new repository("conexoes_google");

export async function atualizarConexaoGoogle(id, dados) {
  return googleRepository.atualizarTudo({
    dadosAtualizar: dados,
    colunaFiltrar: "id",
    dadoFiltrar: id,
    dadosResposta: "*",
  });
}
