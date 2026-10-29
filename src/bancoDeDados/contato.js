import repository from "./db.js";

export const contatoRepository = new repository("mensagens");

export async function criarMensagem(dados) {
  return contatoRepository.criar({
    dados,
    dadosResposta: "*",
  });
}
