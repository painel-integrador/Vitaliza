import {
  criarGrupo,
  entrarEmGrupo,
  exerciciosAtividades,
  sairGrupo,
  usuarios,
} from "../bancoDeDados/grupos.js";
import { autenticar } from "./auth.js";

export async function rotasGrupo(servidor, opts) {
  servidor.addHook("onRequest", autenticar);

  servidor.post("/criar", async (req, res) => {
    try {
      const grupo = await criarGrupo();

      await entrarEmGrupo(req.contaid, grupo.id);

      return res.status(201).send({ id: grupo.id });
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  servidor.post("/entrar", async (req, res) => {
    try {
      await entrarEmGrupo(req.contaid, req.body.grupoId);

      res.send(200);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  servidor.post("/sair", async (req, res) => {
    try {
      await sairGrupo(req.contaid);

      res.status(200);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  servidor.get("/usuarios/:id", async (req, res) => {
    try {
      const usuarios = await usuarios(req.params.id);

      res.status(200).send(usuarios);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  servidor.get("/exercicios-atividades/:id", async (req, res) => {
    try {
      const exercicios = await exerciciosAtividades(req.params.id);

      res.status(200).send(exercicios);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });
}
