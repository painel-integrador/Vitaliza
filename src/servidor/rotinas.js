import {
  buscarTodasRotinas,
  buscarRotinaPorId,
  criarRotina,
  deletarRotina,
} from "../bancoDeDados/rotinas.js";
import { autenticar } from "./auth.js";

export async function rotasRotinas(servidor, opts) {
  servidor.addHook("onRequest", autenticar);

  /*
    Lista todas as rotinas da conta autenticada.
  */
  servidor.get("/rotinas", async (req, res) => {
    try {
      const rotinas = await buscarTodasRotinas(req.contaid);

      return res.status(200).send(rotinas);
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
  servidor.get("/rotina/:id", async (req, res) => {
    try {
      const rotina = await buscarRotinaPorId(Number(req.params.id));

      return res.status(200).send(rotina);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  /*
    body: {
      rotinaDados: {
        nome: string,
      },
      exerciciosDados: [
        {
          nome: string,
          series: number,
          midia?: string[],
        },
      ],
    }
  */
  servidor.post("/rotina", async (req, res) => {
    try {
      const rotina = await criarRotina(
        req.contaid,
        req.body.rotinaDados,
        req.body.exerciciosDados,
      );

      return res.status(201).send(rotina);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  /*
    body: {
      rotinaId: number,
    }
  */
  servidor.delete("/rotina", async (req, res) => {
    try {
      await deletarRotina(req.body.rotinaId);

      return res.status(204).send();
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });
}
