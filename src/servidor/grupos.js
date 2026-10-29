import { autenticar } from "./auth.js";
import {
  criarGrupo,
  entrarEmGrupo,
  exerciciosAtividades,
  sairGrupo,
  usuarios,
} from "../bancoDeDados/grupos.js";

export async function rotasGrupo(servidor, opts) {
  servidor.addHook("onRequest", autenticar);

  /*
    Cria um grupo e já vincula o usuário autenticado nele.
  */
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

  /*
    body: {
      grupoId: number,
    }
  */
  servidor.post("/entrar", async (req, res) => {
    try {
      await entrarEmGrupo(req.contaid, req.body.grupoId);

      return res.status(200).send();
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  /*
    Remove o usuário autenticado do grupo atual.
  */
  servidor.post("/sair", async (req, res) => {
    try {
      await sairGrupo(req.contaid);

      return res.status(200).send();
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
  servidor.get("/usuarios/:id", async (req, res) => {
    try {
      const usuariosGrupo = await usuarios(req.params.id);

      return res.status(200).send(usuariosGrupo);
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
  servidor.get("/exercicios-atividades/:id", async (req, res) => {
    try {
      const usuariosGrupo = await usuarios(req.params.id);
      const exercicios = await exerciciosAtividades(usuariosGrupo);

      return res.status(200).send(exercicios);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });
}
