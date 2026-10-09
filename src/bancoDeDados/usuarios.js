import { conectarUsuarioNaConta } from "./contas.js";
import bancoDados from "./db.js";

export async function getUsuarioId(contaId) {
  // busca o id do usuario
  const conta = await bancoDados
    .from("contas")
    .select("usuario_id")
    .eq("id", contaId)
    .single();

  if (conta.error) {
    console.error(conta.error);
    throw new Error(conta.error.message);
  }

  return conta.data;
}

export async function getUsuario(idUsuario, contaId) {
  // 1. Busca os dados do usuário requisitado (incluindo o grupo dele)
  const { data: usuarioAlvo, error: erroUsuario } = await bancoDados
    .from("usuarios")
    .select(
      "nome,idade,altura,peso,objetivo_hidratacao,objetivo_peso,grupo",
    )
    .eq("id", idUsuario)
    .maybeSingle();

  if (erroUsuario) {
    console.error(erroUsuario);
    throw new Error(erroUsuario.message);
  }

  if (!usuarioAlvo) {
    return "Usuário não encontrado ou sem permissão";
  }

  // 2. Busca na tabela 'contas' para obter o 'usuario_id' da conta logada
  const { data: contaLogada, error: erroConta } = await bancoDados
    .from("contas")
    .select("usuario_id")
    .eq("id", contaId)
    .single();

  if (erroConta) {
    console.error(erroConta);
    throw new Error(erroConta.message);
  }

  // 3. Busca o grupo do usuário logado na tabela 'usuarios'
  const { data: usuarioLogado, error: erroUsuarioLogado } = await bancoDados
    .from("usuarios")
    .select("grupo")
    .eq("id", contaLogada.usuario_id)
    .single();

  if (erroUsuarioLogado) {
    console.error(erroUsuarioLogado);
    throw new Error(erroUsuarioLogado.message);
  }

  // 4. Compara se ambos pertencem ao mesmo grupo (coluna 'grupo')
  if (usuarioLogado.grupo === usuarioAlvo.grupo) {
    return usuarioAlvo;
  } else {
    return "Usuário não encontrado ou sem permissão";
  }
}

export async function criarUsuario(dados, contaId) {
  const { data, error } = await bancoDados
    .from("usuarios") // seleciona a tabela
    .insert(dados) // insere os dados
    .select("id")
    .single(); // retorna a conta criada

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  // conectar usuario na conta
  conectarUsuarioNaConta(contaId, data.id); // data.id é o usuario criado

  return data;
}

export async function atualizarPesoUsuario(contaId, valor) {
  // busca o id do usuario
  const conta = await bancoDados
    .from("contas")
    .select("usuario_id")
    .eq("id", contaId)
    .single();

  if (conta.error) {
    console.error(conta.error);
    throw new Error(conta.error.message);
  }

  const { data, error } = await bancoDados
    .from("usuarios")
    .update({ peso: valor })
    .select("id")
    .single();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}

export async function atualizarObjetivoPesoUsuario(contaId, valor) {
  // busca o id do usuario
  const conta = await bancoDados
    .from("contas")
    .select("usuario_id")
    .eq("id", contaId)
    .single();

  if (conta.error) {
    console.error(conta.error);
    throw new Error(conta.error.message);
  }

  const { data, error } = await bancoDados
    .from("usuarios")
    .update({ objetivo_peso: valor })
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}

export async function atualizarObjetivoHidratacaoUsuario(contaId, valor) {
  // busca o id do usuario
  const conta = await bancoDados
    .from("contas")
    .select("usuario_id")
    .eq("id", contaId)
    .single();

  if (conta.error) {
    console.error(conta.error);
    throw new Error(conta.error.message);
  }

  const { data, error } = await bancoDados
    .from("usuarios")
    .update({ objetivo_hidratacao: valor })
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}
