import bancoDados from "./db.js";

export async function buscarTodosRegistros(contaId) {
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

  const registros = await bancoDados
    .from("registros_hidratacao")
    .select("id, criado_em", "quantidade")
    .eq("usuario_id", conta.data.usuario_id);

  if (registros.error) {
    console.error(registros.error);
    throw new Error(registros.error.message);
  }

  return registros.data;
}

export async function buscarRegistroPorDia(dia, mes, ano, contaId) {
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

  const inicioDia = new Date(ano, mes, dia, 0, 0, 0, 0).toISOString();
  const fimDia = new Date(ano, mes, dia, 23, 59, 59, 999).toISOString();

  // registros
  const registros = await bancoDados
    .from("registros")
    .select()
    .eq("usuario_id", conta.data.usuario_id)
    .gte("criado_em", inicioDia)
    .lte("criado_em", fimDia)
    .single();

  if (registros.error) {
    console.error(registros.error);
    throw new Error(registros.error.message);
  }

  return registros;
}

export async function criarRegistro(contaId, quantidade) {
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

  // registro
  const registro = await bancoDados
    .from("registros_hidratacao")
    .insert({
      quantidade,
      usuario_id: conta.data.usuario_id,
    })
    .select()
    .single();

  if (registro.error) {
    console.error(registro.error);
    throw new Error(registro.error.message);
  }

  return registro;
}

export async function deletarTreino(registroId) {
  // registro
  const registro = await bancoDados
    .from("registros_hidratacao")
    .delete()
    .eq("id", registroId);

  if (registro.error) {
    console.error(registro.error);
    throw new Error(registro.error.message);
  }
}
