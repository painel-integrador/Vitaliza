import { createClient } from "@supabase/supabase-js";

const supabaseClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);

// usa o client do supabase
export default class EntityDB {
  constructor(table) {
    this.client = supabaseClient;
    this.table = table;
  }

  /*
    dadosResposta: string (dados que serão retornados separados por vírgula: ',') 
    ["nome,idade,..."]

    --- 

    Os dados já precisam vir com os nomes e tipos dos campos certo para salvar no DB

    ---

    Exemplo:
    await criar({ dados: {...}, dadosResposta: "id,nome,idade" })
  */
  async criar({ dados, dadosResposta }) {
    const { data, error } = await this.client
      .from(this.table)
      .insert(dados)
      .select(dadosResposta)
      .single();

    if (error) {
      console.error("Erro ao criar na tabela: " + this.table + " - " + error);
      throw new Error(error.message);
    }

    return data;
  }

  /* 
    coluna: string (coluna para comparar o dado, para filtrar a row certa)
    ["id"]

    dado: any (dado para comparar na coluna, para filtrar a row certa)
    [3]

    ---

    Esse método não retorna

    ---

    Exemplo:
    
    await deletar({ coluna: "id", dado: 3 }); // deleta o usuario com id 3
  */
  async deletar({ coluna, dado }) {
    const response = await this.client
      .from(this.table)
      .delete()
      .eq(coluna, dado);

    if (response.error) {
      console.error(
        "Erro ao deletar na tabela: " + this.table + " - " + response.error,
      );
      throw new Error(response.error.message);
    }
  }

  /* 
    colunaAtualizar: string (coluna que será atualizada)
    ["nome"]

    dado: any (dado que será salvo na colunaAtualizar)
    [3]

    colunaFiltrar: string (coluna para comparar o dado, para filtrar a row certa)
    ["id"]

    dadoFiltrar: any (dado para comparar na coluna, para filtrar a row certa)
    [3]

    dadosResposta: string (dados que serão retornados separados por vírgula: ',') 
    ["nome,idade,..."]

    --- 

    Os dados já precisam vir com os nomes e tipos dos campos certo para salvar no DB

    --- 

    Exemplo:
    atualizar({ 
      colunaAtualizar: "nome",
      dadoAtualizar: "Matheus",
      colunaFiltrar: "id",
      dadoFiltrar: 3,
      dadosResposta: "id,nome,idade"
    })
  */
  async atualizar({
    colunaAtualizar,
    dadoAtualizar,
    colunaFiltrar,
    dadoFiltrar,
    dadosResposta,
  }) {
    const { data, error } = await this.client
      .from(this.table)
      .update({ [colunaAtualizar]: dadoAtualizar }) // estar em colchetes, faz pegar o valor da variavel, e usar como campo no objeto
      .eq(colunaFiltrar, dadoFiltrar)
      .select(dadosResposta)
      .single();

    if (error) {
      console.error(
        "Erro ao atualizar na tabela: " +
          this.table +
          " | coluna: " +
          colunaAtualizar +
          " - " +
          error,
      );
      throw new Error(error.message);
    }

    return data;
  }

  async atualizarTudo({
    dadosAtualizar,
    colunaFiltrar,
    dadoFiltrar,
    dadosResposta,
  }) {
    const { data, error } = await this.client
      .from(this.table)
      .update({ [colunaAtualizar]: dadoAtualizar }) // estar em colchetes, faz pegar o valor da variavel, e usar como campo no objeto
      .eq(colunaFiltrar, dadoFiltrar)
      .select(dadosResposta)
      .single();

    if (error) {
      console.error(
        "Erro ao atualizar na tabela: " +
          this.table +
          " | coluna: " +
          colunaAtualizar +
          " - " +
          error,
      );
      throw new Error(error.message);
    }

    return data;
  }

  /* 
    dadosResposta: string (dados que serão retornados separados por vírgula: ',') 
    ["nome,idade,..."]

    contadorRange: number (indíce da paginação, começa em 0, cada página vem com 10)
    [2]

    --- 

    Os dados já precisam vir com os nomes e tipos dos campos certo para salvar no DB

    A paginação começa em 0 e vem de 10 em 10, exemplo:
    se o contadorRange for 0: 0 - 9,
    se for 1: 10 - 19, se for 2: 20 - 29 ...

    ---
    
    Exemplo: 
    await todos({ dadosResposta: "id,nome,idade", contadorRange: 2})
  */
  async todos({ dadosResposta, contadorRange }) {
    let rangeInicio,
      rangeFinal = 0;

    // paginação começa em 0: página 1

    // vai indo de 10 em 10:
    // se contadorRange for 1 (página 2): 10 - 19,
    // se for 2 (página 3): 20 - 29 ...
    if (contadorRange === 0) {
      rangeInicio = 0;
      rangeFinal = 9;
    } else {
      rangeInicio = 10 * contadorRange;
      rangeFinal = 9 + 10 * contadorRange;
    }

    const { data, error } = await this.client
      .from(this.table)
      .select(dadosResposta)
      .range(rangeInicio, rangeFinal);

    if (error) {
      console.error(
        "Erro ao ler todos na tabela: " + this.table + " - " + error,
      );
      throw new Error(error.message);
    }

    return data;
  }

  /* 
    coluna: string (coluna para filtrar)
    ["email"]

    dado: any (dado a ser comparado na busca)
    ["teste@email.com"]

    dadosResposta: string (dados que serão retornados separados por vírgula: ',') 
    ["nome,idade,..."]

    --- 
    Retorna apenas um único registro correspondente.
    
    Exemplo: 
    await procurarUm({ coluna: "email", dado: "teste@email.com", dadosResposta: "id,nome,email" })
  */
  async procurarUm({ coluna, dado, dadosResposta }) {
    const { data, error } = await this.client
      .from(this.table)
      .select(dadosResposta)
      .eq(coluna, dado)
      .single();

    if (error) {
      console.error(
        "Erro ao procurar um registro na tabela: " +
          this.table +
          " | coluna: " +
          coluna +
          " - " +
          error,
      );
      throw new Error(error.message);
    }

    return data;
  }

  /* 
    coluna: string (coluna para filtrar)
    ["status"]

    dado: any (dado a ser comparado na busca)
    ["ativo"]

    dadosResposta: string (dados que serão retornados separados por vírgula: ',') 
    ["nome,idade,..."]

    contadorRange: number (indíce da paginação, começa em 0, cada página vem com 10)
    [0]

    --- 
    A paginação começa em 0 e vem de 10 em 10, assim como no método 'todos'.

    Exemplo: 
    await procurarVarios({ coluna: "status", dado: "ativo", dadosResposta: "id,nome,status", contadorRange: 0 })
  */
  async procurarVarios({ coluna, dado, dadosResposta, contadorRange }) {
    let rangeInicio,
      rangeFinal = 0;

    if (contadorRange === 0) {
      rangeInicio = 0;
      rangeFinal = 9;
    } else {
      rangeInicio = 10 * contadorRange;
      rangeFinal = 9 + 10 * contadorRange;
    }

    const { data, error } = await this.client
      .from(this.table)
      .select(dadosResposta)
      .eq(coluna, dado)
      .range(rangeInicio, rangeFinal);

    if (error) {
      console.error(
        "Erro ao procurar vários registros na tabela: " +
          this.table +
          " | coluna: " +
          coluna +
          " - " +
          error,
      );
      throw new Error(error.message);
    }

    return data;
  }

  /* 
    coluna: string (coluna numérica ou de data para aplicar o intervalo)
    ["idade"]

    inicio: any (valor inicial da faixa)
    [18]

    final: any (valor final da faixa)
    [30]

    dadosResposta: string (dados que serão retornados separados por vírgula: ',') 
    ["nome,idade,..."]

    contadorRange: number (indíce da paginação, começa em 0, cada página vem com 10)
    [0]

    --- 
    Utiliza o filtro 'gte' (maior ou igual) para o início e 'lte' (menor ou igual) para o final.
    Também possui suporte à paginação de 10 em 10.

    Exemplo: 
    await procurarFaixa({ coluna: "idade", inicio: 18, final: 30, dadosResposta: "id,nome,idade", contadorRange: 0 })
  */
  async procurarFaixa({ coluna, inicio, final, dadosResposta, contadorRange }) {
    let rangeInicio,
      rangeFinal = 0;

    if (contadorRange === 0) {
      rangeInicio = 0;
      rangeFinal = 9;
    } else {
      rangeInicio = 10 * contadorRange;
      rangeFinal = 9 + 10 * contadorRange;
    }

    const { data, error } = await this.client
      .from(this.table)
      .select(dadosResposta)
      .gte(coluna, inicio)
      .lte(coluna, final)
      .range(rangeInicio, rangeFinal);

    if (error) {
      console.error(
        "Erro ao procurar por faixa na tabela: " +
          this.table +
          " | coluna: " +
          coluna +
          " - " +
          error,
      );
      throw new Error(error.message);
    }

    return data;
  }
}
