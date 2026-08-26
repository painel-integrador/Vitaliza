import {
  buscarTodosTreinos,
  buscarTreinoPorId,
  criarTreino,
  deletarTreino,
} from "../bancoDeDados/treinos.js";
import { autenticar } from "./auth.js";

export async function rotasTreino(servidor, opts) {
  // os requests pegam o req.contaid

  servidor.addHook("onRequest", autenticar);

  servidor.get("/treinos", async (req, res) => {
    try {
      const treinos = await buscarTodosTreinos(req.contaid);

      return res.status(200).send(treinos);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  servidor.get("/treinos/:id", async (req, res) => {
    try {
      const treinos = await buscarTreinoPorId(req.params.id);

      return res.status(200).send(treinos);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  /* { 
        treinoDados: {
          calorias: number
        },
        seriesDados: [
          {
            numero: number,
            reps: number,
            peso: number,
            exercise_db_id
          }
        ]
  */
  servidor.post("/treino", async (req, res) => {
    try {
      const treinos = await criarTreino(
        req.contaid,
        req.body.treinoDados,
        req.body.seriesDados,
      );

      return res.status(201).send(treinos);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  /* 
    {
      treinoId: number,
    }
  */
  servidor.delete("/treino", async (req, res) => {
    try {
      const treinos = await deletarTreino(req.body.treinoId);

      return res.status(204).send();
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  servidor.get("/teste", async (req, res) => {
    return res.status(200).send(req.contaid);
  });
}
