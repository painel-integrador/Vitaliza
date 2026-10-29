import {
  criarUsuario,
  atualizarObjetivoHidratacaoUsuario,
  atualizarObjetivoPesoUsuario,
  atualizarPesoUsuario,
  getUsuario,
  getUsuarioId,
} from "../bancoDeDados/usuarios.js";
import { autenticar } from "./auth.js";

export async function rotasUsuario(servidor, opts) {
  servidor.addHook("onRequest", autenticar);

  /*
    params: {
      id: number,
    }
  */
  servidor.get("/usuario/:id", async (req, res) => {
    try {
      const usuario = await getUsuario(Number(req.params.id), req.contaid);

      if (usuario === "Usuário não encontrado ou sem permissão") {
        return res.status(403).send("Usuário não encontrado ou sem permissão");
      }

      return res.status(200).send(usuario);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  /*
    Retorna o id do usuário vinculado à conta autenticada.
  */
  servidor.get("/id", async (req, res) => {
    try {
      const id = await getUsuarioId(req.contaid);

      return res.status(200).send(id);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  /*
    body: {
      nome: string,
      idade: number,
      altura: number,
      peso: number,
      objetivo_hidratacao?: number,
      objetivo_peso?: number,
    }
  */
  servidor.post("/usuario", async (req, res) => {
    try {
      await criarUsuario(req.body, req.contaid);

      return res.redirect(process.env.URL + "/home");
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  /*
    body: {
      peso: number,
    }
  */
  servidor.post("/atualizar/peso", async (req, res) => {
    try {
      const usuario = await atualizarPesoUsuario(req.contaid, req.body.peso);

      return res.status(200).send(usuario);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  /*
    body: {
      objetivoPeso: number,
    }
  */
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

  /*
    body: {
      objetivoHidratacao: number,
    }
  */
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
