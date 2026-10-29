import { autenticar } from "./auth.js";
import { contasRepository } from "../bancoDeDados/contas.js";
import { hidratacaoRepository } from "../bancoDeDados/hidratacao.js";

async function usuarioIdDaConta(contaId) {
  const conta = await contasRepository.procurarUm({
    coluna: "id",
    dado: contaId,
    dadosResposta: "usuario_id",
  });

  if (!conta?.usuario_id) throw new Error("Conta sem usuário vinculado");
  return conta.usuario_id;
}

export async function rotasHidratacao(servidor, opts) {
  servidor.addHook("onRequest", autenticar);

  servidor.post("/criar", async (req, res) => {
    try {
      const usuarioId = await usuarioIdDaConta(req.contaid);

      const registro = await hidratacaoRepository.criar({
        dados: { quantidade: req.body.quantidade, usuario_id: usuarioId },
        dadosResposta: "*",
      });

      return res.status(201).send(registro);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  servidor.get("/registros", async (req, res) => {
    try {
      const usuarioId = await usuarioIdDaConta(req.contaid);

      const registros = await hidratacaoRepository.procurarVarios({
        coluna: "usuario_id",
        dado: usuarioId,
        dadosResposta: "id,criado_em,quantidade",
      });

      return res.status(200).send(registros);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  servidor.get("/registro/:dia/:mes/:ano", async (req, res) => {
    try {
      const usuarioId = await usuarioIdDaConta(req.contaid);
      const dia = Number(req.params.dia);
      const mes = Number(req.params.mes) - 1;
      const ano = Number(req.params.ano);

      const inicioDia = new Date(ano, mes, dia, 0, 0, 0, 0).toISOString();
      const fimDia = new Date(ano, mes, dia, 23, 59, 59, 999).toISOString();

      const registrosDia = await hidratacaoRepository.procurarFaixa({
        coluna: "criado_em",
        inicio: inicioDia,
        final: fimDia,
        dadosResposta: "*",
      });

      return res
        .status(200)
        .send(registrosDia.filter((r) => r.usuario_id === usuarioId));
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  servidor.delete("/registro", async (req, res) => {
    try {
      await hidratacaoRepository.deletar({
        coluna: "id",
        dado: req.body.registroId,
      });

      return res.status(204).send();
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });
}
