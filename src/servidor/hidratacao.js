import { autenticar } from "./auth.js";
import {
  buscarTodosRegistros,
  buscarRegistroPorDia,
  criarRegistro,
  deletarRegistro,
} from "../bancoDeDados/hidratacao.js";

async function rotasHidratacao(servidor, opts) {
  servidor.addHook("onRequest", autenticar);

  servidor.post("/criar", async (req, res) => {
    try {
      const quantidade = req.body.quantidade;

      const registro = await criarRegistro(req.contaid, quantidade);

      res.status(201).send(registro);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  servidor.get("/registros", async (req, res) => {
    try {
      const registros = await buscarTodosRegistros(req.contaid);

      res.status(200).send(registros);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  servidor.get("registro/:dia/:mes/:ano", async (req, res) => {
    const { dia, mes, ano } = req.params;

    buscarRegistroPorDia(dia,mes,ano,)
  });
}
