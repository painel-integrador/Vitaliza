import bancoDados from "./db.js";

export async function criarSessao(dados) {
  const { data, error } = await bancoDados
    .from("sessoes") // seleciona a tabela
    .insert(dados) // insere os dados
    .select(); // retorna a sessão criada

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}

export async function buscarSessaoPorToken(accessToken) {
  const { data, error } = await bancoDados
    .from("sessoes") // seleciona a tabela
    .select("*") // busca a sessão
    .eq("access_token", accessToken); // que tenha o access token do cookie do usuário

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
    .from("sessoes") // seleciona a tabela
    .update({
      access_token: accessToken,
      refresh_token: refreshToken,
      access_token_expira_em: expiraEmDuasHoras,
      refresh_token_expira_em: expiraEmDuasHoras,
    }) // atualiza os dados
    .eq({ id: session_id }) // na sessão certa
    .select(); // retorna a sessão atualizada

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}
