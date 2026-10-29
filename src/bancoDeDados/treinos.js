import { contasRepository } from "./contas.js";
import repository from "./db.js";

export const treinosRepository = new repository("treinos");
export const seriesRepository = new repository("series");

async function buscarUsuarioIdDaConta(contaId) {
  const conta = await contasRepository.procurarUm({
    coluna: "id",
    dado: contaId,
    dadosResposta: "usuario_id",
  });

  if (!conta || !conta.usuario_id) {
    throw new Error("Conta sem usuário vinculado");
  }

  return conta.usuario_id;
}

export async function buscarTodosTreinos(contaId) {
  const usuarioId = await buscarUsuarioIdDaConta(contaId);

  return treinosRepository.procurarVarios({
    coluna: "usuario_id",
    dado: usuarioId,
    dadosResposta: "id,criado_em",
  });
}

export async function buscarTreinoPorId(treinoId) {
  const treino = await treinosRepository.procurarUm({
    coluna: "id",
    dado: treinoId,
    dadosResposta: "*",
  });

  if (!treino) {
    throw new Error("Treino não encontrado");
  }

  const series = await seriesRepository.procurarVarios({
    coluna: "treino_id",
    dado: treinoId,
    dadosResposta: "*",
  });

  return {
    treino,
    series,
  };
}

export async function criarTreino(contaId, seriesDados) {
  const usuarioId = await buscarUsuarioIdDaConta(contaId);

  const treino = await treinosRepository.criar({
    dados: {
      usuario_id: usuarioId,
    },
    dadosResposta: "*",
  });

  const seriesComTreinoId = seriesDados.map((serie) => ({
    ...serie,
    treino_id: treino.id,
  }));

  const seriesCriadas = [];

  for (const serie of seriesComTreinoId) {
    const serieCriada = await seriesRepository.criar({
      dados: serie,
      dadosResposta: "*",
    });

    seriesCriadas.push(serieCriada);
  }

  return {
    treinoReturn: treino,
    seriesReturn: seriesCriadas,
  };
}

export async function deletarTreino(treinoId) {
  await treinosRepository.deletar({
    coluna: "id",
    dado: treinoId,
  });
}
