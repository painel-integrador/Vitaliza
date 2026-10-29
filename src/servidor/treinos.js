import { autenticar } from "./auth.js";
import { contasRepository } from "../bancoDeDados/contas.js";
import {
  treinosRepository,
  seriesRepository,
} from "../bancoDeDados/treinos.js";

async function usuarioIdDaConta(contaId) {
  const conta = await contasRepository.procurarUm({
    coluna: "id",
    dado: contaId,
    dadosResposta: "usuario_id",
  });

  if (!conta?.usuario_id) throw new Error("Conta sem usuário vinculado");
  return conta.usuario_id;
}

export async function rotasTreino(servidor, opts) {
  servidor.addHook("onRequest", autenticar);

  servidor.get("/treinos", async (req, res) => {
    try {
      const usuarioId = await usuarioIdDaConta(req.contaid);

      const treinos = await treinosRepository.procurarVarios({
        coluna: "usuario_id",
        dado: usuarioId,
        dadosResposta: "id,criado_em",
      });

      return res.status(200).send(treinos);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  servidor.get("/treinos/:id", async (req, res) => {
    try {
      const treinoId = Number(req.params.id);

      const treino = await treinosRepository.procurarUm({
        coluna: "id",
        dado: treinoId,
        dadosResposta: "*",
      });

      const series = await seriesRepository.procurarVarios({
        coluna: "treino_id",
        dado: treinoId,
        dadosResposta: "*",
      });

      return res.status(200).send({ treino, series });
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  servidor.post("/treino", async (req, res) => {
    try {
      const usuarioId = await usuarioIdDaConta(req.contaid);

      const treino = await treinosRepository.criar({
        dados: { usuario_id: usuarioId },
        dadosResposta: "*",
      });

      const seriesReturn = [];
      for (const serie of req.body.seriesDados) {
        const serieCriada = await seriesRepository.criar({
          dados: { ...serie, treino_id: treino.id },
          dadosResposta: "*",
        });
        seriesReturn.push(serieCriada);
      }

      return res.status(201).send({
        treinoReturn: treino,
        seriesReturn,
      });
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  servidor.delete("/treino", async (req, res) => {
    try {
      await treinosRepository.deletar({
        coluna: "id",
        dado: req.body.treinoId,
      });

      return res.status(204).send();
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });
}
