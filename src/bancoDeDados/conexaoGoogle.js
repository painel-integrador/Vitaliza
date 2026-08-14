import bancoDados from "./db.js";

export async function criarConexaoGoogle(dados) {
  const { data, error } = await bancoDados
    .from("conexoes_google")
    .insert(dados)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}
