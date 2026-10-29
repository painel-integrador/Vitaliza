import {
  buscarTodosTreinos,
  buscarTreinoPorId,
  criarTreino,
  deletarTreino,
} from "../bancoDeDados/treinos.js";
import { autenticar } from "./auth.js";

export async function rotasTreino(servidor, opts) {
  servidor.addHook("onRequest", autenticar);

  /*
    Lista todos os treinos da conta autenticada.
  */
  servidor.get("/treinos", async (req, res) => {
    try {
      const treinos = await buscarTodosTreinos(req.contaid);

      return res.status(200).send(treinos);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  /*
    params: {
      id: number,
    }
  */
  servidor.get("/treinos/:id", async (req, res) => {
    try {
      const treinos = await buscarTreinoPorId(Number(req.params.id));

      return res.status(200).send(treinos);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  /*
    body: {
      seriesDados: [
        {
          numero: number,
          reps: number,
          peso: number,
          exercise_db_id: number,
        },
      ],
    }
  */
  servidor.post("/treino", async (req, res) => {
    try {
      const treinos = await criarTreino(req.contaid, req.body.seriesDados);

      return res.status(201).send(treinos);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  /*
    body: {
      treinoId: number,
    }
  */
  servidor.delete("/treino", async (req, res) => {
    try {
      await deletarTreino(req.body.treinoId);

      return res.status(204).send();
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });
}
