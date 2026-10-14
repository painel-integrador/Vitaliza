import repository from "./db.js";

export const googleRepository = new repository("conexoes_google");

export async function atualizarConexaoGoogle(id, dados) {
  const { data, error } = await bancoDados
    .from("conexoes_google")
    .update(dados)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}
