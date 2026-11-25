import { autenticar } from "./auth.js";
import { contasRepository } from "../bancoDeDados/contas.js";
import { usuarioRepository } from "../bancoDeDados/usuarios.js";

async function usuarioIdDaConta(contaId) {
  const conta = await contasRepository.procurarUm({
    coluna: "id",
    dado: contaId,
    dadosResposta: "usuario_id",
  });

  if (!conta?.usuario_id) throw new Error("Conta sem usuário vinculado");
  return conta.usuario_id;
}

export async function rotasUsuario(servidor, opts) {
  servidor.addHook("onRequest", autenticar);

  servidor.get("/usuario/:id", async (req, res) => {
    try {
      const usuarioLogadoId = await usuarioIdDaConta(req.contaid);

      // "me" vira o id do usuário logado
      const idUsuario =
        req.params.id === "me" ? usuarioLogadoId : Number(req.params.id);

      const usuarioAlvo = await usuarioRepository.procurarUm({
        coluna: "id",
        dado: idUsuario,
        dadosResposta: "id,nome,idade,altura,peso,grupo,avatar,criado_em",
      });

      if (!usuarioAlvo) {
        return res.status(403).send("Usuário não encontrado ou sem permissão");
      }

      // O próprio usuário sempre pode ver o próprio perfil
      if (idUsuario === usuarioLogadoId) {
        return res.status(200).send(usuarioAlvo);
      }

      // Outro usuário: só se estiver no mesmo grupo
      const usuarioLogado = await usuarioRepository.procurarUm({
        coluna: "id",
        dado: usuarioLogadoId,
        dadosResposta: "grupo",
      });

      if (!usuarioLogado || usuarioLogado.grupo !== usuarioAlvo.grupo) {
        return res.status(403).send("Usuário não encontrado ou sem permissão");
      }

      return res.status(200).send(usuarioAlvo);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro: erro.message });
    }
  });

  servidor.get("/id", async (req, res) => {
    try {
      const usuario_id = await usuarioIdDaConta(req.contaid);
      return res.status(200).send({ usuario_id });
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  servidor.post("/usuario", async (req, res) => {
    try {
      const usuario = await usuarioRepository.criar({
        dados: req.body,
        dadosResposta: "id",
      });

      await contasRepository.atualizar({
        colunaAtualizar: "usuario_id",
        dadoAtualizar: usuario.id,
        colunaFiltrar: "id",
        dadoFiltrar: req.contaid,
        dadosResposta: "*",
      });

      return res.redirect(process.env.URL + "/perfil");
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  servidor.post("/atualizar/peso", async (req, res) => {
    try {
      const usuarioId = await usuarioIdDaConta(req.contaid);

      const usuario = await usuarioRepository.atualizar({
        colunaAtualizar: "peso",
        dadoAtualizar: req.body.peso,
        colunaFiltrar: "id",
        dadoFiltrar: usuarioId,
        dadosResposta: "id,peso",
      });

      return res.status(200).send(usuario);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });
}
