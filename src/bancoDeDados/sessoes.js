import bancoDados from "./db.js";

export async function criarSessao(dados) {
  const { data, error } = await bancoDados
    .from("sessoes")
    .insert(dados)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}

export async function buscarSessaoPorToken(accessToken) {
  const { data, error } = await bancoDados
    .from("sessoes")
    .select("*")
    .eq("access_token", accessToken)
    .maybeSingle(); // Retorna o objeto direto ou null

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}

export async function atualizarTokens(
  sessionId,
  accessToken,
  refreshToken,
  expiraEmDuasHoras,
  expiraEmDoisMeses,
) {
  const { data, error } = await bancoDados
    .from("sessoes")
    .update({
      access_token: accessToken,
      refresh_token: refreshToken,
      access_token_expira_em: expiraEmDuasHoras,
      refresh_token_expira_em: expiraEmDoisMeses, // Corrigido para expiraEmDoisMeses
    })
    .eq("id", sessionId) // Corrigido o método .eq
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}
