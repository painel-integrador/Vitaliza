import bancoDados from "./db.js";

export async function criarGrupo() {
  const { data, error } = await bancoDados
    .from("grupos")
    .insert()
    .select()
    .single();

  if (error) {
    console.error(conta.error);
    throw new Error(conta.error.message);
  }

  return data;
}

export async function entrarEmGrupo(contaId, grupoId) {
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
    .from("usuarios") // seleciona a tabela
    .update({ grupo: grupoId }) // insere o id do grupo
    .eq("usuario_id", conta.data.usuario_id)
    .select()
    .single(); // retorna o user com grupo

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}

export async function usuarios(grupoId) {
  const { data, error } = await bancoDados
    .from("usuarios")
    .eq("grupo", grupoId)
    .select();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}

export async function exerciciosAtividades(usuarios) {
  let treinos = [];
  usuarios.forEach(async (usuario) => {
    const { data, error } = await bancoDados
      .from("treinos")
      .select()
      .eq("usuario_id", usuario.id);

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }

    treinos.push(data);
  });

  return treinos;
}

export async function sairGrupo(contaId) {
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
    .from("usuarios") // seleciona a tabela
    .update({ grupo: null }) // deleta o id
    .eq("usuario_id", conta.data.usuario_id)
    .select()
    .single(); // retorna o user sem o grupo

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}
