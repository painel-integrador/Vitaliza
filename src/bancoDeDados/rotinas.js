import bancoDados from "./db.js";

export async function buscarTodasRotinas(contaId) {
  const conta = await bancoDados
    .from("contas")
    .select("usuario_id")
    .eq("id", contaId)
    .single();

  if (conta.error) {
    console.error(conta.error);
    throw new Error(conta.error.message);
  }

  const rotinas = await bancoDados
    .from("rotinas")
    .select("id, criado_em, nome")
    .eq("usuario_id", conta.data.usuario_id);

  if (rotinas.error) {
    console.error(rotinas.error);
    throw new Error(rotinas.error.message);
  }

  return rotinas.data;
}

export async function buscarRotinaPorId(rotinaId) {
  // rotina
  const rotina = await bancoDados
    .from("rotinas")
    .select()
    .eq("id", rotinaId)
    .single();

  if (rotina.error) {
    console.error(rotina.error);
    throw new Error(rotina.error.message);
  }

  // exercicios
  const exercicios = await bancoDados
    .from("exercicios_rotinas")
    .select()
    .eq("rotina_id", rotinaId);

  if (exercicios.error) {
    console.error(exercicios.error);
    throw new Error(exercicios.error.message);
  }

  return {
    rotina,
    exercicios,
  };
}

export async function criarRotina(contaId, rotinaDados, exerciciosDados) {
  const conta = await bancoDados
    .from("contas")
    .select("usuario_id")
    .eq("id", contaId)
    .single();

  if (conta.error) {
    console.error(conta.error);
    throw new Error(conta.error.message);
  }

  // rotina
  const rotina = await bancoDados
    .from("rotinas")
    .insert({
      nome: rotinaDados.nome,
      usuario_id: conta.data.usuario_id,
    })
    .select()
    .single();

  if (rotina.error) {
    console.error(rotina.error);
    throw new Error(rotina.error.message);
  }

  // inserir o rotinaId no objeto, para todos do array
  const exerciciosComRotinaId = exerciciosDados.map((exercicio) => ({
    ...exercicio,
    rotina_id: rotina.data.id,
  }));

  // séries
  const exercicios = await bancoDados
    .from("exercicios_rotinas")
    .insert(exerciciosComRotinaId)
    .select();

  if (exercicios.error) {
    console.error(exercicios.error);
    throw new Error(exercicios.error.message);
  }

  const rotinaReturn = rotina.data;
  const exerciciosReturn = exercicios.data;

  return {
    rotinaReturn,
    exerciciosReturn,
  };
}

export async function deletarRotina(rotinaId) {
  // rotina
  const rotina = await bancoDados.from("rotinas").delete().eq("id", rotinaId);

  if (rotina.error) {
    console.error(rotina.error);
    throw new Error(rotina.error.message);
  }
}
