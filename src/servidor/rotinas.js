import {
  buscarTodasRotinas,
  buscarRotinaPorId,
  criarRotina,
  deletarRotina,
} from "../bancoDeDados/rotinas.js";
import { autenticar } from "./auth.js";

export async function rotasRotinas(servidor, opts) {
  // os requests contém o req.contaid
  servidor.addHook("onRequest", autenticar);

  servidor.get("/rotinas", async (req, res) => {
    console.log(req.contaid);
    try {
      const rotinas = await buscarTodasRotinas(req.contaid);

      return res.status(200).send(rotinas);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  servidor.get("/rotina/:id", async (req, res) => {
    try {
      const rotina = await buscarRotinaPorId(req.params.id);

      return res.status(200).send(rotina);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  /* { 
      rotinaDados: {
        nome: string,
      },
      exerciciosDados: [
        {
          nome: string,
          series: number,
          midia?: string[]
        }
      ]
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
    {
      rotinaId: number,
    }
  */
  servidor.delete("/rotina", async (req, res) => {
    try {
      await deletarRotina(req.body.rotinaId);

      return res.status(204).send({ msg: "Rotina deletada" });
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });
}
