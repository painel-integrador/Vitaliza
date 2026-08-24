import bancoDados from "./db.js";

export async function buscarTodosExercicios(contaId) {
  const treinos = await bancoDados.from("contas").select("historico_treinos");

  return treinos;
}
