import { conectarUsuarioNaConta } from "./contas.js";
import bancoDados from "./db.js";

export async function getUsuarioId(contaId) {
  // busca o id do usuario
  const conta = await bancoDados
    .from("contas")
    .select("usuario_id")
    .eq("id", contaId)
    .single();

  if (conta.error) {
    console.error(conta.error);
    throw new Error(conta.error.message);
  }

  return conta.data;
}

export async function getUsuario(idUsuario, contaId) {
  const { data, error } = await bancoDados
    .from("usuarios")
    .select("nome,idade,altura,peso,objetivo_hidratacao,objetivo_peso,grupo")
    .eq("id", idUsuario)
    .single();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  const conta = await bancoDados
    .from("usuarios")
    .select("grupo")
    .eq("id", contaId)
    .single();

  if (conta.error) {
    console.error(conta.error);
    throw new Error(conta.error.message);
  }

  if (conta.data.grupo_id === data.grupo_id) return data;
  else {
    return "Usuário não encontrado ou sem permissão";
  }
}

export async function criarUsuario(dados, contaId) {
  const { data, error } = await bancoDados
    .from("usuarios") // seleciona a tabela
    .insert(dados) // insere os dados
    .select("id")
    .single(); // retorna a conta criada

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  // conectar usuario na conta
  conectarUsuarioNaConta(contaId, data.id); // data.id é o usuario criado

  return data;
}

export async function atualizarPesoUsuario(contaId, valor) {
  // busca o id do usuario
  const conta = await bancoDados
    .from("contas")
    .select("usuario_id")
    .eq("id", contaId)
    .single();

  if (conta.error) {
    console.error(conta.error);
    throw new Error(conta.error.message);
  }

  const { data, error } = await bancoDados
    .from("usuarios")
    .update({ peso: valor })
    .select("id")
    .single();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}

export async function atualizarObjetivoPesoUsuario(contaId, valor) {
  // busca o id do usuario
  const conta = await bancoDados
    .from("contas")
    .select("usuario_id")
    .eq("id", contaId)
    .single();

  if (conta.error) {
    console.error(conta.error);
    throw new Error(conta.error.message);
  }

  const { data, error } = await bancoDados
    .from("usuarios")
    .update({ objetivo_peso: valor })
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}

export async function atualizarObjetivoHidratacaoUsuario(contaId, valor) {
  // busca o id do usuario
  const conta = await bancoDados
    .from("contas")
    .select("usuario_id")
    .eq("id", contaId)
    .single();

  if (conta.error) {
    console.error(conta.error);
    throw new Error(conta.error.message);
  }

  const { data, error } = await bancoDados
    .from("usuarios")
    .update({ objetivo_hidratacao: valor })
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}
