import { contasRepository } from "./contas.js";
import repository from "./db.js";

export const rotinasRepository = new repository("rotinas");
export const exerciciosRotinasRepository = new repository("exercicios_rotinas");

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

export async function buscarTodasRotinas(contaId) {
  const usuarioId = await buscarUsuarioIdDaConta(contaId);

  return rotinasRepository.procurarVarios({
    coluna: "usuario_id",
    dado: usuarioId,
    dadosResposta: "id,criado_em,nome",
  });
}

export async function buscarRotinaPorId(rotinaId) {
  const rotina = await rotinasRepository.procurarUm({
    coluna: "id",
    dado: rotinaId,
    dadosResposta: "*",
  });

  if (!rotina) {
    throw new Error("Rotina não encontrada");
  }

  const exercicios = await exerciciosRotinasRepository.procurarVarios({
    coluna: "rotina_id",
    dado: rotinaId,
    dadosResposta: "*",
  });

  return {
    rotina,
    exercicios,
  };
}

export async function criarRotina(contaId, rotinaDados, exerciciosDados) {
  const usuarioId = await buscarUsuarioIdDaConta(contaId);

  const rotina = await rotinasRepository.criar({
    dados: {
      nome: rotinaDados.nome,
      usuario_id: usuarioId,
    },
    dadosResposta: "*",
  });

  const exerciciosComRotinaId = exerciciosDados.map((exercicio) => ({
    ...exercicio,
    rotina_id: rotina.id,
  }));

  const exerciciosCriados = [];

  for (const exercicio of exerciciosComRotinaId) {
    const exercicioCriado = await exerciciosRotinasRepository.criar({
      dados: exercicio,
      dadosResposta: "*",
    });

    exerciciosCriados.push(exercicioCriado);
  }

  return {
    rotinaReturn: rotina,
    exerciciosReturn: exerciciosCriados,
  };
}

export async function deletarRotina(rotinaId) {
  await rotinasRepository.deletar({
    coluna: "id",
    dado: rotinaId,
  });
}
