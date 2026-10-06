import {
  criarUsusario,
  atualizarObjetivoHidratacaoUsuario,
  atualizarObjetivoPesoUsuario,
  atualizarPesoUsuario,
  getUsuario,
  getUsuarioId,
} from "../bancoDeDados/usuarios.js";
import { autenticar } from "./auth.js";

export async function rotasUsuario(servidor, opts) {
  servidor.addHook("onRequest", autenticar);

  servidor.get("/usuario/:id", async (req, res) => {
    try {
      const usuario = await getUsuario(req.params.id, req.contaid);

      if (usuario === "Usuário não encontrado ou sem permissão") {
        return res.status(403).send("Usuário não encontrado ou sem permissão")
      }

      return res.status(200).send(usuario);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  servidor.get("/id", async (req, res) => {
    try {
      const id = await getUsuarioId(req.contaid);

      return res.status(200).send(id);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  servidor.post("/usuario", async (req, res) => {
    try {
      const usuario = criarUsusario(req.body);

      return res.status(201).send(usuario);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  servidor.post("/atualizar/peso", async (req, res) => {
    try {
      const usuario = await atualizarPesoUsuario(req.contaid, req.body.peso);

      return res.status(200).send(usuario);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  servidor.post("/atualizar/objetivo-peso", async (req, res) => {
    try {
      const usuario = await atualizarObjetivoPesoUsuario(
        req.contaid,
        req.body.objetivoPeso,
      );

      return res.status(200).send(usuario);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  servidor.post("/atualizar/objetivo-hidratacao", async (req, res) => {
    try {
      const usuario = await atualizarObjetivoHidratacaoUsuario(
        req.contaid,
        req.body.objetivoHidratacao,
      );

      return res.status(200).send(usuario);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });
}
