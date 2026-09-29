import bancoDados from "./db.js";

export async function criarMensagem(dados) {
  const { data, error } = await bancoDados
    .from("mensagens")
    .insert(dados)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}
