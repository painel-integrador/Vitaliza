import { autenticar } from "./auth.js";
import {
  buscarTodosRegistros,
  buscarRegistroPorDia,
  criarRegistro,
  deletarRegistro,
} from "../bancoDeDados/hidratacao.js";

export async function rotasHidratacao(servidor, opts) {
  servidor.addHook("onRequest", autenticar);

  /*
    body: {
      quantidade: number,
    }
  */
  servidor.post("/criar", async (req, res) => {
    try {
      const registro = await criarRegistro(req.contaid, req.body.quantidade);

      return res.status(201).send(registro);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  /*
    Lista os registros de hidratação da conta autenticada.
  */
  servidor.get("/registros", async (req, res) => {
    try {
      const registros = await buscarTodosRegistros(req.contaid);

      return res.status(200).send(registros);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  /*
    params: {
      dia: number,
      mes: number,
      ano: number,
    }
  */
  servidor.get("/registro/:dia/:mes/:ano", async (req, res) => {
    try {
      const { dia, mes, ano } = req.params;
      const registros = await buscarRegistroPorDia(dia, mes, ano, req.contaid);

      return res.status(200).send(registros);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  /*
    body: {
      registroId: number,
    }
  */
  servidor.delete("/registro", async (req, res) => {
    try {
      await deletarRegistro(req.body.registroId);

      return res.status(204).send();
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });
}
