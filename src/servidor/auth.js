import { hash, compare } from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import { contasRepository } from "../bancoDeDados/contas.js";
import { sessoesRepository } from "../bancoDeDados/sessoes.js";
import { googleRepository } from "../bancoDeDados/conexaoGoogle.js";

function criarAccessToken() {
  const duasHoras = 2 * 60 * 60 * 1000;
  const expiraEmDuasHoras = new Date(Date.now() + duasHoras);
  const accessToken = crypto.randomBytes(32).toString("hex");
  return { expiraEmDuasHoras, accessToken };
}

function criarRefreshToken() {
  const doisMeses = 60 * 24 * 60 * 60 * 1000;
  const expiraEmDoisMeses = new Date(Date.now() + doisMeses);
  const refreshToken = crypto.randomBytes(32).toString("hex");
  return { expiraEmDoisMeses, refreshToken };
}

export const oAuthClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/api/auth/google/callback",
);

async function criarSessaoCookie(req, res, contaId) {
  const { expiraEmDuasHoras, accessToken } = criarAccessToken();
  const { expiraEmDoisMeses, refreshToken } = criarRefreshToken();

  await sessoesRepository.criar({
    dados: {
      access_token: accessToken,
      refresh_token: refreshToken,
      access_token_expira_em: expiraEmDuasHoras,
      refresh_token_expira_em: expiraEmDoisMeses,
      endereco_ip: req.ip,
      user_agent: req.headers["user-agent"],
      conta_id: contaId,
    },
    dadosResposta: "*",
  });

  res.setCookie("access_token", accessToken, {
    path: "/",
    httpOnly: true,
    secure: process.env.ENV === "producao",
    maxAge: 2 * 60 * 60,
    sameSite: "lax",
  });

  res.setCookie("refresh_token", refreshToken, {
    path: "/",
    httpOnly: true,
    secure: process.env.ENV === "producao",
    maxAge: 60 * 24 * 60 * 60,
    sameSite: "lax",
  });
}

export async function autenticar(req, res) {
  try {
    const accessToken = req.cookies.access_token;
    if (!accessToken)
      return res.status(401).send({ erro: "Token de acesso ausente" });

    const sessao = await sessoesRepository.procurarUm({
      coluna: "access_token",
      dado: accessToken,
      dadosResposta: "*",
    });

    if (!sessao) return res.status(401).send({ erro: "Sessão não encontrada" });

    const agora = new Date();
    const tokenAcessoExpirou = new Date(sessao.access_token_expira_em) < agora;
    const tokenRefreshExpirou =
      new Date(sessao.refresh_token_expira_em) < agora;

    if (tokenAcessoExpirou && tokenRefreshExpirou) {
      return res.status(401).send({ erro: "Sessão expirada" });
    }

    if (tokenAcessoExpirou && !tokenRefreshExpirou) {
      const { expiraEmDuasHoras, accessToken: novoAccessToken } =
        criarAccessToken();
      const { expiraEmDoisMeses, refreshToken: novoRefreshToken } =
        criarRefreshToken();

      await sessoesRepository.atualizarTudo({
        dadosAtualizar: {
          access_token: novoAccessToken,
          refresh_token: novoRefreshToken,
          access_token_expira_em: expiraEmDuasHoras,
          refresh_token_expira_em: expiraEmDoisMeses,
        },
        colunaFiltrar: "id",
        dadoFiltrar: sessao.id,
        dadosResposta: "*",
      });

      res.setCookie("access_token", novoAccessToken, {
        path: "/",
        httpOnly: true,
        secure: process.env.ENV === "producao",
        maxAge: 2 * 60 * 60,
        sameSite: "lax",
      });

      res.setCookie("refresh_token", novoRefreshToken, {
        path: "/",
        httpOnly: true,
        secure: process.env.ENV === "producao",
        maxAge: 60 * 24 * 60 * 60,
        sameSite: "lax",
      });
    }

    req.contaid = Number(sessao.conta_id);
  } catch (erro) {
    console.error(erro);
    return res.status(500).send({ erro });
  }
}

export async function rotasAuth(servidor, opts) {
  servidor.post("/criar_conta/email_senha", async (req, res) => {
    try {
      const senhaCripto = await hash(req.body.senha, 10);

      const contaCriada = await contasRepository.criar({
        dados: {
          email: req.body.email,
          senha_cripto: senhaCripto,
        },
        dadosResposta: "*",
      });

      await criarSessaoCookie(req, res, contaCriada.id);
      return res.redirect(process.env.URL + "/conta/criar-usuario");
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  servidor.post("/login/email_senha", async (req, res) => {
    try {
      const conta = await contasRepository.procurarUm({
        coluna: "email",
        dado: req.body.email,
        dadosResposta: "*",
      });

      if (!conta)
        return res.status(401).send({ erro: "Email ou senha inválidos" });

      const senhaValida = await compare(req.body.senha, conta.senha_cripto);
      if (!senhaValida)
        return res.status(401).send({ erro: "Email ou senha inválidos" });

      await criarSessaoCookie(req, res, conta.id);
      return res.redirect(process.env.URL + "/home");
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  servidor.get("/google", async (req, res) => {
    const url = oAuthClient.generateAuthUrl({
      prompt: "consent",
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "openid",
      ],
    });
    return res.redirect(url);
  });

  servidor.get("/google/callback", async (req, res) => {
    try {
      const code = req.query.code;
      const tokens = await oAuthClient.getToken(code);
      const payload = (
        await oAuthClient.verifyIdToken({
          idToken: tokens.tokens.id_token,
          audience: process.env.GOOGLE_CLIENT_ID,
        })
      ).getPayload();

      let conexaoExistente = await googleRepository.procurarUm({
        coluna: "google_id",
        dado: payload.sub,
        dadosResposta: "*",
      });

      const dadosConexao = {
        google_id: payload.sub,
        access_token: tokens.tokens.access_token,
        refresh_token: tokens.tokens.refresh_token,
        expira_em: new Date(tokens.tokens.expiry_date),
      };

      if (conexaoExistente) {
        conexaoExistente = await googleRepository.atualizarTudo({
          dadosAtualizar: dadosConexao,
          colunaFiltrar: "id",
          dadoFiltrar: conexaoExistente.id,
          dadosResposta: "*",
        });
      } else {
        conexaoExistente = await googleRepository.criar({
          dados: dadosConexao,
          dadosResposta: "*",
        });
      }

      const contaBanco = await contasRepository.procurarUm({
        coluna: "email",
        dado: payload.email,
        dadosResposta: "*",
      });

      let targetContaId;

      if (!contaBanco) {
        const novaConta = await contasRepository.criar({
          dados: {
            email: payload.email,
            conexao_google_id: conexaoExistente.id,
          },
          dadosResposta: "*",
        });

        targetContaId = novaConta.id;
        await criarSessaoCookie(req, res, targetContaId);
        return res.redirect(process.env.URL + "/conta/criar-usuario");
      }

      if (!contaBanco.conexao_google_id) {
        await contasRepository.atualizar({
          colunaAtualizar: "conexao_google_id",
          dadoAtualizar: conexaoExistente.id,
          colunaFiltrar: "id",
          dadoFiltrar: contaBanco.id,
          dadosResposta: "*",
        });
      }

      targetContaId = contaBanco.id;
      await criarSessaoCookie(req, res, targetContaId);
      return res.redirect(process.env.URL + "/home");
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  servidor.get("/me", { preHandler: [autenticar] }, async (req, res) => {
    return res.send({ logado: true, contaId: req.contaid });
  });

  servidor.post("/sair", async (req, res) => {
    const accessToken = req.cookies.access_token;
    if (!accessToken)
      return res.status(401).send({ erro: "Token de acesso ausente" });

    await sessoesRepository.deletar({
      coluna: "access_token",
      dado: accessToken,
    });

    res.setCookie("access_token", "", {
      path: "/",
      httpOnly: true,
      secure: process.env.ENV === "producao",
      sameSite: "lax",
      maxAge: 0,
      expires: new Date(0),
    });

    res.setCookie("refresh_token", "", {
      path: "/",
      httpOnly: true,
      secure: process.env.ENV === "producao",
      sameSite: "lax",
      maxAge: 0,
      expires: new Date(0),
    });

    return res.redirect(process.env.URL + "/");
  });
}
