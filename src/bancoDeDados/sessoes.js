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

export async function buscarSessaoPorToken(token) {
  const { data, error } = await bancoDados
    .from("sessoes") // seleciona a tabela
    .select("*") // busca a sessão
    .eq("token", token); // que tenha o token do cookie do usuário

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}
