import bancoDados from "./db.js";

export async function buscarTodosTreinos(contaId) {
  const conta = await bancoDados
    .from("contas")
    .select("usuario_id")
    .eq("id", contaId)
    .single();

  if (conta.error) {
    console.error(conta.error);
    throw new Error(conta.error.message);
  }

  const treinos = await bancoDados
    .from("treinos")
    .select("id, criado_em")
    .eq("usuario_id", conta.data.usuario_id);

  if (treinos.error) {
    console.error(treinos.error);
    throw new Error(treinos.error.message);
  }

  return treinos.data;
}

export async function buscarTreinoPorId(treinoId) {
  // treino
  const treino = await bancoDados
    .from("treinos")
    .select()
    .eq("id", treinoId)
    .single();

  if (treino.error) {
    console.error(treino.error);
    throw new Error(treino.error.message);
  }

  // séries
  const series = await bancoDados
    .from("series")
    .select()
    .eq("treino_id", treinoId);

  if (series.error) {
    console.error(series.error);
    throw new Error(series.error.message);
  }

  return {
    treino,
    series,
  };
}

export async function criarTreino(contaId, treinoDados, seriesDados) {
  const conta = await bancoDados
    .from("contas")
    .select("usuario_id")
    .eq("id", contaId)
    .single();

  if (conta.error) {
    console.error(conta.error);
    throw new Error(conta.error.message);
  }

  // treino
  const treino = await bancoDados
    .from("treinos")
    .insert({
      calorias: treinoDados.calorias,
      usuario_id: conta.data.usuario_id,
    })
    .select()
    .single();

  if (treino.error) {
    console.error(treino.error);
    throw new Error(treino.error.message);
  }

  // inserir o treino_id no objeto, para todos do array
  const seriesComTreinoId = seriesDados.map((serie) => ({
    ...serie,
    treino_id: treino.data.id,
  }));

  // séries
  const series = await bancoDados
    .from("series")
    .insert(seriesComTreinoId)
    .select();

  if (series.error) {
    console.error(series.error);
    throw new Error(series.error.message);
  }

  const treinoReturn = treino.data;
  const seriesReturn = series.data;

  return {
    treinoReturn,
    seriesReturn,
  };
}

export async function deletarTreino(treinoId) {
  // treino
  const treino = await bancoDados.from("treinos").delete().eq("id", treinoId);

  if (treino.error) {
    console.error(treino.error);
    throw new Error(treino.error.message);
  }
}
