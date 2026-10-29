import { contasRepository } from "./contas.js";
import repository from "./db.js";

export const gruposRepository = new repository("grupos");
export const usuariosRepository = new repository("usuarios");
export const treinosRepository = new repository("treinos");

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

export async function criarGrupo() {
  return gruposRepository.criar({
    dados: {},
    dadosResposta: "*",
  });
}

export async function entrarEmGrupo(contaId, grupoId) {
  const usuarioId = await buscarUsuarioIdDaConta(contaId);

  return usuariosRepository.atualizar({
    colunaAtualizar: "grupo",
    dadoAtualizar: grupoId,
    colunaFiltrar: "id",
    dadoFiltrar: usuarioId,
    dadosResposta: "*",
  });
}

export async function usuarios(grupoId) {
  return usuariosRepository.procurarVarios({
    coluna: "grupo",
    dado: grupoId,
    dadosResposta: "*",
  });
}

export async function exerciciosAtividades(usuariosGrupo) {
  const treinosPorUsuario = await Promise.all(
    usuariosGrupo.map(async (usuario) =>
      treinosRepository.procurarVarios({
        coluna: "usuario_id",
        dado: usuario.id,
        dadosResposta: "*",
      }),
    ),
  );

  return treinosPorUsuario.flat();
}

export async function sairGrupo(contaId) {
  const usuarioId = await buscarUsuarioIdDaConta(contaId);

  return usuariosRepository.atualizar({
    colunaAtualizar: "grupo",
    dadoAtualizar: null,
    colunaFiltrar: "id",
    dadoFiltrar: usuarioId,
    dadosResposta: "*",
  });
}
