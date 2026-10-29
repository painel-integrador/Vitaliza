import { autenticar } from "./auth.js";
import { contasRepository } from "../bancoDeDados/contas.js";
import { gruposRepository } from "../bancoDeDados/grupos.js";
import { usuarioRepository } from "../bancoDeDados/usuarios.js";
import { treinosRepository } from "../bancoDeDados/treinos.js";

async function usuarioIdDaConta(contaId) {
  const conta = await contasRepository.procurarUm({
    coluna: "id",
    dado: contaId,
    dadosResposta: "usuario_id",
  });

  if (!conta?.usuario_id) throw new Error("Conta sem usuário vinculado");
  return conta.usuario_id;
}

export async function rotasGrupo(servidor, opts) {
  servidor.addHook("onRequest", autenticar);

  servidor.post("/criar", async (req, res) => {
    try {
      const grupo = await gruposRepository.criar({
        dados: {},
        dadosResposta: "*",
      });

      const usuarioId = await usuarioIdDaConta(req.contaid);
      await usuarioRepository.atualizar({
        colunaAtualizar: "grupo",
        dadoAtualizar: grupo.id,
        colunaFiltrar: "id",
        dadoFiltrar: usuarioId,
        dadosResposta: "*",
      });

      return res.status(201).send({ id: grupo.id });
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  servidor.post("/entrar", async (req, res) => {
    try {
      const usuarioId = await usuarioIdDaConta(req.contaid);
      await usuarioRepository.atualizar({
        colunaAtualizar: "grupo",
        dadoAtualizar: req.body.grupoId,
        colunaFiltrar: "id",
        dadoFiltrar: usuarioId,
        dadosResposta: "*",
      });

      return res.status(200).send();
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  servidor.post("/sair", async (req, res) => {
    try {
      const usuarioId = await usuarioIdDaConta(req.contaid);
      await usuarioRepository.atualizar({
        colunaAtualizar: "grupo",
        dadoAtualizar: null,
        colunaFiltrar: "id",
        dadoFiltrar: usuarioId,
        dadosResposta: "*",
      });

      return res.status(200).send();
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  servidor.get("/usuarios/:id", async (req, res) => {
    try {
      const usuariosGrupo = await usuarioRepository.procurarVarios({
        coluna: "grupo",
        dado: Number(req.params.id),
        dadosResposta: "*",
      });

      return res.status(200).send(usuariosGrupo);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  servidor.get("/exercicios-atividades/:id", async (req, res) => {
    try {
      const usuariosGrupo = await usuarioRepository.procurarVarios({
        coluna: "grupo",
        dado: Number(req.params.id),
        dadosResposta: "id",
      });

      const treinosPorUsuario = await Promise.all(
        usuariosGrupo.map((u) =>
          treinosRepository.procurarVarios({
            coluna: "usuario_id",
            dado: u.id,
            dadosResposta: "*",
          }),
        ),
      );

      return res.status(200).send(treinosPorUsuario.flat());
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });
}
