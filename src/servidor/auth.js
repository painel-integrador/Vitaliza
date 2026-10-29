import { hash, compare } from "bcrypt";
import {
  buscarContaPorEmail,
  conectarGoogleNaConta,
  criarConta,
} from "../bancoDeDados/contas.js";
import {
  criarSessao,
  buscarSessaoPorToken,
  atualizarTokens,
  deletarSessao,
} from "../bancoDeDados/sessoes.js";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
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

/* Função de criação de sessão que salva nos cookies */
async function criarSessaoCookie(req, res, contaId) {
  const { expiraEmDuasHoras, accessToken } = criarAccessToken();
  const { expiraEmDoisMeses, refreshToken } = criarRefreshToken();

  const userAgent = req.headers["user-agent"];
  const enderecoIp = req.ip;

  await criarSessao({
    access_token: accessToken,
    refresh_token: refreshToken,
    access_token_expira_em: expiraEmDuasHoras,
    refresh_token_expira_em: expiraEmDoisMeses,
    endereco_ip: enderecoIp,
    user_agent: userAgent,
    conta_id: contaId,
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

    if (!accessToken) {
      return res.status(401).send({ erro: "Token de acesso ausente" });
    }

    const sessao = await buscarSessaoPorToken(accessToken);
    const horaAtual = new Date();

    if (!sessao) {
      return res.status(401).send({ erro: "Sessão não encontrada" });
    }

    const tokenAcessoExpirou =
      new Date(sessao.access_token_expira_em) < horaAtual;
    const tokenRefreshExpirou =
      new Date(sessao.refresh_token_expira_em) < horaAtual;

    if (tokenAcessoExpirou && tokenRefreshExpirou) {
      return res.status(401).send({ erro: "Sessão expirada" });
    }

    if (tokenAcessoExpirou && !tokenRefreshExpirou) {
      const { expiraEmDuasHoras, accessToken: novoAccessToken } =
        criarAccessToken();
      const { expiraEmDoisMeses, refreshToken: novoRefreshToken } =
        criarRefreshToken();

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

      await atualizarTokens(
        sessao.id,
        novoAccessToken,
        novoRefreshToken,
        expiraEmDuasHoras,
        expiraEmDoisMeses,
      );
    }

    req.contaid = Number(sessao.conta_id);
  } catch (erro) {
    console.error(erro);
    return res.status(500).send({ erro });
  }
}

export async function rotasAuth(servidor, opts) {
  /*
    body: {
      email: string,
      senha: string,
    }
  */
  servidor.post("/criar_conta/email_senha", async (req, res) => {
    const dados = req.body;
    const salt = 10;

    try {
      const senhaCripto = await hash(dados.senha, salt);

      const conta = {
        email: dados.email,
        senha_cripto: senhaCripto,
      };

      const contaCriada = await criarConta(conta);

      await criarSessaoCookie(req, res, contaCriada.id);

      return res.redirect(process.env.URL + "/conta/criar-usuario");
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  /*
    body: {
      email: string,
      senha: string,
    }
  */
  servidor.post("/login/email_senha", async (req, res) => {
    const dados = req.body;

    try {
      const conta = await buscarContaPorEmail(dados.email);

      if (!conta) {
        return res.status(401).send({ erro: "Email ou senha inválidos" });
      }

      const senhaValida = await compare(dados.senha, conta.senha_cripto);

      if (!senhaValida) {
        return res.status(401).send({ erro: "Email ou senha inválidos" });
      }

      await criarSessaoCookie(req, res, conta.id);

      return res.redirect(process.env.URL + "/home");
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  /*
    Inicia autenticação OAuth2 com Google.
  */
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

  /*
    Callback de autenticação Google.
  */
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
          colunaFiltrar: "id",
          dadoFiltrar: conexaoExistente.id,
          dadosAtualizar: dadosConexao,
          dadosResposta: "*",
        });
      } else {
        conexaoExistente = await googleRepository.criar({
          dados: dadosConexao,
          dadosResposta: "*",
        });
      }

      const contaBanco = await buscarContaPorEmail(payload.email);
      let targetContaId;

      if (!contaBanco) {
        const novaConta = await criarConta({
          email: payload.email,
          conexao_google_id: conexaoExistente.id,
        });

        targetContaId = novaConta.id;

        await criarSessaoCookie(req, res, targetContaId);
        return res.redirect(process.env.URL + "/conta/criar-usuario");
      }

      if (!contaBanco.conexao_google_id) {
        await conectarGoogleNaConta(contaBanco.id, conexaoExistente.id);
      }

      targetContaId = contaBanco.id;

      await criarSessaoCookie(req, res, targetContaId);

      return res.redirect(process.env.URL + "/home");
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  /*
    Verifica sessão autenticada.
  */
  servidor.get("/me", { preHandler: [autenticar] }, async (req, res) => {
    return res.send({ logado: true, contaId: req.contaid });
  });

  /*
    Encerra sessão e remove cookies de autenticação.
  */
  servidor.post("/sair", async (req, res) => {
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
      return res.status(401).send({ erro: "Token de acesso ausente" });
    }

    await deletarSessao(accessToken);

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
