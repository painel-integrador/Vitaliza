import bancoDados from "./db.js";

export async function buscarConexaoGooglePorGoogleId(googleId) {
  const { data, error } = await bancoDados
    .from("conexoes_google")
    .select("*")
    .eq("google_id", googleId)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}

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
