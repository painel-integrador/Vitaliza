import { contasRepository } from "./contas.js";
import repository from "./db.js";

export const hidratacaoRepository = new repository("registros_hidratacao");

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

export async function buscarTodosRegistros(contaId) {
  const usuarioId = await buscarUsuarioIdDaConta(contaId);

  return hidratacaoRepository.procurarVarios({
    coluna: "usuario_id",
    dado: usuarioId,
    dadosResposta: "id,criado_em,quantidade",
  });
}

export async function buscarRegistroPorDia(dia, mes, ano, contaId) {
  const usuarioId = await buscarUsuarioIdDaConta(contaId);

  const mesIndex = Number(mes) - 1;
  const inicioDia = new Date(Number(ano), mesIndex, Number(dia), 0, 0, 0, 0).toISOString();
  const fimDia = new Date(Number(ano), mesIndex, Number(dia), 23, 59, 59, 999).toISOString();

  const registros = await hidratacaoRepository.procurarFaixa({
    coluna: "criado_em",
    inicio: inicioDia,
    final: fimDia,
    dadosResposta: "*",
  });

  return registros.filter((registro) => registro.usuario_id === usuarioId);
}

export async function criarRegistro(contaId, quantidade) {
  const usuarioId = await buscarUsuarioIdDaConta(contaId);

  return hidratacaoRepository.criar({
    dados: {
      quantidade,
      usuario_id: usuarioId,
    },
    dadosResposta: "*",
  });
}

export async function deletarRegistro(registroId) {
  await hidratacaoRepository.deletar({
    coluna: "id",
    dado: registroId,
  });
}
