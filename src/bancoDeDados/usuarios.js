import { conectarUsuarioNaConta, contasRepository } from "./contas.js";
import repository from "./db.js";

export const usuarioRepository = new repository("usuarios");

export async function getUsuarioId(contaId) {
  const conta = await contasRepository.procurarUm({
    coluna: "id",
    dado: contaId,
    dadosResposta: "usuario_id",
  });

  if (!conta || !conta.usuario_id) {
    throw new Error("Conta sem usuário vinculado");
  }

  return conta;
}

export async function getUsuario(idUsuario, contaId) {
  const usuarioAlvo = await usuarioRepository.procurarUm({
    coluna: "id",
    dado: idUsuario,
    dadosResposta: "id,nome,idade,altura,peso,objetivo_hidratacao,objetivo_peso,grupo",
  });

  if (!usuarioAlvo) {
    return "Usuário não encontrado ou sem permissão";
  }

  const contaLogada = await contasRepository.procurarUm({
    coluna: "id",
    dado: contaId,
    dadosResposta: "usuario_id",
  });

  if (!contaLogada || !contaLogada.usuario_id) {
    throw new Error("Conta logada sem usuário vinculado");
  }

  const usuarioLogado = await usuarioRepository.procurarUm({
    coluna: "id",
    dado: contaLogada.usuario_id,
    dadosResposta: "grupo",
  });

  if (!usuarioLogado) {
    throw new Error("Usuário logado não encontrado");
  }

  if (usuarioLogado.grupo === usuarioAlvo.grupo) {
    return usuarioAlvo;
  }

  return "Usuário não encontrado ou sem permissão";
}

export async function criarUsuario(dados, contaId) {
  const usuario = await usuarioRepository.criar({
    dados,
    dadosResposta: "id",
  });

  await conectarUsuarioNaConta(contaId, usuario.id);

  return usuario;
}

export async function atualizarPesoUsuario(contaId, valor) {
  const conta = await getUsuarioId(contaId);

  return usuarioRepository.atualizar({
    colunaAtualizar: "peso",
    dadoAtualizar: valor,
    colunaFiltrar: "id",
    dadoFiltrar: conta.usuario_id,
    dadosResposta: "id,peso",
  });
}

export async function atualizarObjetivoPesoUsuario(contaId, valor) {
  const conta = await getUsuarioId(contaId);

  return usuarioRepository.atualizar({
    colunaAtualizar: "objetivo_peso",
    dadoAtualizar: valor,
    colunaFiltrar: "id",
    dadoFiltrar: conta.usuario_id,
    dadosResposta: "id,objetivo_peso",
  });
}

export async function atualizarObjetivoHidratacaoUsuario(contaId, valor) {
  const conta = await getUsuarioId(contaId);

  return usuarioRepository.atualizar({
    colunaAtualizar: "objetivo_hidratacao",
    dadoAtualizar: valor,
    colunaFiltrar: "id",
    dadoFiltrar: conta.usuario_id,
    dadosResposta: "id,objetivo_hidratacao",
  });
}
