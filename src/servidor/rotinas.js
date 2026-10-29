import { autenticar } from "./auth.js";
import { contasRepository } from "../bancoDeDados/contas.js";
import {
  rotinasRepository,
  exerciciosRotinasRepository,
} from "../bancoDeDados/rotinas.js";

async function usuarioIdDaConta(contaId) {
  const conta = await contasRepository.procurarUm({
    coluna: "id",
    dado: contaId,
    dadosResposta: "usuario_id",
  });

  if (!conta?.usuario_id) throw new Error("Conta sem usuário vinculado");
  return conta.usuario_id;
}

export async function rotasRotinas(servidor, opts) {
  servidor.addHook("onRequest", autenticar);

  servidor.get("/rotinas", async (req, res) => {
    try {
      const usuarioId = await usuarioIdDaConta(req.contaid);

      const rotinas = await rotinasRepository.procurarVarios({
        coluna: "usuario_id",
        dado: usuarioId,
        dadosResposta: "id,criado_em,nome",
      });

      return res.status(200).send(rotinas);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  servidor.get("/rotina/:id", async (req, res) => {
    try {
      const rotinaId = Number(req.params.id);

      const rotina = await rotinasRepository.procurarUm({
        coluna: "id",
        dado: rotinaId,
        dadosResposta: "*",
      });

      const exercicios = await exerciciosRotinasRepository.procurarVarios({
        coluna: "rotina_id",
        dado: rotinaId,
        dadosResposta: "*",
      });

      return res.status(200).send({ rotina, exercicios });
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  servidor.post("/rotina", async (req, res) => {
    try {
      const usuarioId = await usuarioIdDaConta(req.contaid);

      const rotina = await rotinasRepository.criar({
        dados: {
          nome: req.body.rotinaDados.nome,
          usuario_id: usuarioId,
        },
        dadosResposta: "*",
      });

      const exerciciosReturn = [];
      for (const exercicio of req.body.exerciciosDados) {
        const criado = await exerciciosRotinasRepository.criar({
          dados: { ...exercicio, rotina_id: rotina.id },
          dadosResposta: "*",
        });
        exerciciosReturn.push(criado);
      }

      return res.status(201).send({
        rotinaReturn: rotina,
        exerciciosReturn,
      });
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  servidor.delete("/rotina", async (req, res) => {
    try {
      await rotinasRepository.deletar({
        coluna: "id",
        dado: req.body.rotinaId,
      });

      return res.status(204).send();
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });
}
