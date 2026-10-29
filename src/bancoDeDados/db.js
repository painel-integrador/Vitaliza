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

  _range(contadorRange) {
    if (contadorRange === undefined || contadorRange === null) {
      return null;
    }

    if (contadorRange === 0) {
      return { rangeInicio: 0, rangeFinal: 9 };
    }

    return {
      rangeInicio: 10 * contadorRange,
      rangeFinal: 9 + 10 * contadorRange,
    };
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
  async criar({ dados, dadosResposta = "*" }) {
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
    const response = await this.client.from(this.table).delete().eq(coluna, dado);

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

    dadoAtualizar: any (dado que será salvo na colunaAtualizar)
    ["Matheus"]

    colunaFiltrar: string (coluna para comparar o dado, para filtrar a row certa)
    ["id"]

    dadoFiltrar: any (dado para comparar na coluna, para filtrar a row certa)
    [3]

    dadosResposta: string (dados que serão retornados separados por vírgula: ',')
    ["nome,idade,..."]
  */
  async atualizar({
    colunaAtualizar,
    dadoAtualizar,
    colunaFiltrar,
    dadoFiltrar,
    dadosResposta = "*",
  }) {
    const { data, error } = await this.client
      .from(this.table)
      .update({ [colunaAtualizar]: dadoAtualizar })
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
    dadosAtualizar: object (campos e valores que serão atualizados)

    colunaFiltrar: string (coluna para comparar o dado, para filtrar a row certa)
    ["id"]

    dadoFiltrar: any (dado para comparar na coluna, para filtrar a row certa)
    [3]

    dadosResposta: string (dados que serão retornados separados por vírgula: ',')
    ["nome,idade,..."]
  */
  async atualizarTudo({
    dadosAtualizar,
    colunaFiltrar,
    dadoFiltrar,
    dadosResposta = "*",
  }) {
    const { data, error } = await this.client
      .from(this.table)
      .update(dadosAtualizar)
      .eq(colunaFiltrar, dadoFiltrar)
      .select(dadosResposta)
      .single();

    if (error) {
      console.error(
        "Erro ao atualizar tudo na tabela: " +
          this.table +
          " | coluna filtro: " +
          colunaFiltrar +
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

    Sem contadorRange, retorna todos os registros.
  */
  async todos({ dadosResposta = "*", contadorRange }) {
    let query = this.client.from(this.table).select(dadosResposta);
    const range = this._range(contadorRange);

    if (range) {
      query = query.range(range.rangeInicio, range.rangeFinal);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erro ao ler todos na tabela: " + this.table + " - " + error);
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
    Retorna apenas um único registro correspondente, ou null quando não existir.
  */
  async procurarUm({ coluna, dado, dadosResposta = "*" }) {
    const { data, error } = await this.client
      .from(this.table)
      .select(dadosResposta)
      .eq(coluna, dado)
      .maybeSingle();

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
    Sem contadorRange, retorna todos os registros filtrados.
  */
  async procurarVarios({ coluna, dado, dadosResposta = "*", contadorRange }) {
    let query = this.client
      .from(this.table)
      .select(dadosResposta)
      .eq(coluna, dado);

    const range = this._range(contadorRange);
    if (range) {
      query = query.range(range.rangeInicio, range.rangeFinal);
    }

    const { data, error } = await query;

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
    Sem contadorRange, retorna todos os registros da faixa.
  */
  async procurarFaixa({ coluna, inicio, final, dadosResposta = "*", contadorRange }) {
    let query = this.client
      .from(this.table)
      .select(dadosResposta)
      .gte(coluna, inicio)
      .lte(coluna, final);

    const range = this._range(contadorRange);
    if (range) {
      query = query.range(range.rangeInicio, range.rangeFinal);
    }

    const { data, error } = await query;

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
