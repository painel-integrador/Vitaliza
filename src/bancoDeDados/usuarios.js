import bancoDados from "./db.js";

export async function criarUsusario(dados) {
  const { data, error } = await bancoDados
    .from("usuarios") // seleciona a tabela
    .insert(dados) // insere os dados
    .select()
    .single(); // retorna a conta criada

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

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

  const { data, error } = bancoDados
    .from("usuarios")
    .update({ peso: valor })
    .select()
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

  const { data, error } = bancoDados
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

  const { data, error } = bancoDados
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
