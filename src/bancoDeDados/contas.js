import bancoDados from "./db.js";

export async function criarConta(dados) {
  const { data, error } = await bancoDados
    .from("contas") // seleciona a tabela
    .insert(dados) // insere os dados
    .select()
    .single(); // retorna a conta criada

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}

export async function buscarContaPorEmail(email) {
  const { data, error } = await bancoDados
    .from("contas") // seleciona a tabela
    .select("*") // busca a conta
    .eq("email", email) // que tenha o email inserido pelo usuário
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}

/* Adiciona o id da linha da tabela de conexões com o Google, à linha da tabela de contas*/
export async function conectarGoogleNaConta(contaId, conexaoGoogleId) {
  const { data, error } = await bancoDados
    .from("contas")
    .update({ conexao_google_id: conexaoGoogleId })
    .eq("id", contaId)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}
