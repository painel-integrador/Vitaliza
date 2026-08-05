import { hash } from "bcrypt";
import { buscarContaPorEmail, criarConta } from "../bancoDeDados/contas.js";
import {
  criarSessao,
  buscarSessaoPorToken,
  atualizarTokens,
} from "../bancoDeDados/sessoes.js";
import crypto from "crypto";

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

/* Função de criação de sessão que salva nos cookies */
async function criarSessao(req, res, contaId) {
  // token e expiração
  const { expiraEmDuasHoras, accessToken } = criarAccessToken();
  const { expiraEmDoisMeses, refreshToken } = criarRefreshToken();

  // pegar os dados
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
    maxAge: 7 * 24 * 60 * 60, // tempo de vida do cookie
    sameSite: "lax",
  });

  res.setCookie("refresh_token", refreshToken, {
    path: "/auth/refresh",
    httpOnly: true,
    secure: process.env.ENV === "producao",
    maxAge: 7 * 24 * 60 * 60, // tempo de vida do cookie
    sameSite: "strict",
  });
}

/*
 * Contém todas as rotas e middlewares de autenticação
 * */
export async function rotasAuth(servidor, opts) {
  /*
   * Recebe:
   * { email: string, senha: string }
   * */
  servidor.post("/criar_conta_email_senha", async (req, res) => {
    const dados = req.body;
    const salt = 10; // rodadas para criptografar

    try {
      const senhaCripto = await hash(dados.senha, salt);

      const conta = {
        email: dados.email,
        senha_cripto: senhaCripto,
      };

      const contaCriada = await criarConta(conta);

      await criarSessao(req, res, contaCriada.id);

      return res.redirect(process.env.URL + "/exercicios");
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  /*
   * Recebe:
   * { email: string, senha: string }
   * */
  servidor.post("/login_email_senha", async (req, res) => {
    const dados = req.body;
    const salt = 10;

    try {
      const senhaCripto = await hash(dados.senha, salt);

      const conta = buscarContaPorEmail(dados.email);

      if (!conta) {
        return res.status(401).send({ erro: "Email ou senha inválidos" });
      }

      if (conta.senha_cripto !== senhaCripto) {
        return res.status(401).send({ erro: "Email ou senha inválidos" });
      }

      await criarSessao(req, res, conta.id);

      return res.redirect(process.env.URL + "/exercicios");
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });
}

/*
 * Middleware de autenticação e validação dos tokens
 * */
export async function autenticar(req, res) {
  try {
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;

    // buscar sessao
    const sessao = await buscarSessaoPorToken(accessToken);

    if (
      !sessao ||
      (sessao.access_token_expira_em < horaAtual &&
        sessao.refresh_token_expira_em < horaAtual)
    ) {
      return res.status(401).send("Sessão não encontrada ou expirada");
    }

    const horaAtual = new Date();

    // gerar novo access token e refresh token
    if (
      sessao.access_token_expira_em < horaAtual &&
      sessao.refresh_token_expira_em > horaAtual
    ) {
      ({ expiraEmDuasHoras, accessToken } = criarAccessToken());
      ({ expiraEmDoisMeses, refreshToken } = criarRefreshToken());

      // atualizar os cookies e atualizar DB
      res.setCookie("access_token", accessToken, {
        path: "/",
        httpOnly: true,
        secure: process.env.ENV === "producao",
        maxAge: 7 * 24 * 60 * 60, // tempo de vida do cookie
        sameSite: "lax",
      });

      res.setCookie("refresh_token", refreshToken, {
        path: "/auth/refresh",
        httpOnly: true,
        secure: process.env.ENV === "producao",
        maxAge: 7 * 24 * 60 * 60, // tempo de vida do cookie
        sameSite: "strict",
      });

      await atualizarTokens(
        sessao.id,
        accessToken,
        refreshToken,
        expiraEmDuasHoras,
        expiraEmDoisMeses,
      );
    }
  } catch (erro) {
    console.error(erro);
    return res.status(500).send({ erro });
  }
}
