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
} from "../bancoDeDados/sessoes.js";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import { criarConexaoGoogle } from "../bancoDeDados/conexaoGoogle.js";

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

export async function rotasAuth(servidor, opts) {
  // EMAIL E SENHA

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

      return res.redirect(process.env.URL + "/exercicios");
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  /* {
    email: string,
    senha: string,
  }
  */
  servidor.post("/login/email_senha", async (req, res) => {
    const dados = req.body;

    try {
      // Faltava o await na busca da conta
      const conta = await buscarContaPorEmail(dados.email);

      if (!conta) {
        return res.status(401).send({ erro: "Email ou senha inválidos" });
      }

      // Uso correto da comparação de hash via bcrypt.compare
      const senhaValida = await compare(dados.senha, conta.senha_cripto);

      if (!senhaValida) {
        return res.status(401).send({ erro: "Email ou senha inválidos" });
      }

      await criarSessaoCookie(req, res, conta.id);

      return res.redirect(process.env.URL + "/exercicios");
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });

  // GOOGLE

  servidor.get("/google", async (req, res) => {
    const url = oAuthClient.generateAuthUrl({
      prompt: "consent",
      access_type: "offline",
      scope: [
        // profile
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "openid",

        // health
        "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.writeonly",
        "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
        "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
        "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.writeonly",
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

      const contaBanco = await buscarContaPorEmail(payload.email);
      let targetContaId;

      // conta não existe: cria conta e conexão
      if (!contaBanco) {
        const conexaoGoogle = await criarConexaoGoogle({
          google_id: payload.sub,
          access_token: tokens.tokens.access_token,
          refresh_token: tokens.tokens.refresh_token,
          expira_em: new Date(tokens.tokens.expiry_date),
        });

        const novaConta = await criarConta({
          email: payload.email,
          conexao_google_id: conexaoGoogle.id,
        });

        targetContaId = novaConta.id;
      }
      // conta existe mas sem conexão Google: apenas conecta
      else if (!contaBanco.conexao_google_id) {
        const conexaoGoogle = await criarConexaoGoogle({
          google_id: payload.sub,
          access_token: tokens.tokens.access_token,
          refresh_token: tokens.tokens.refresh_token,
          expira_em: new Date(tokens.tokens.expiry_date),
        });

        await conectarGoogleNaConta(contaBanco.id, conexaoGoogle.id);
        targetContaId = contaBanco.id;
      }
      // conta e conexão já existem
      else {
        targetContaId = contaBanco.id;
      }

      await criarSessaoCookie(req, res, targetContaId);
      return res.redirect(process.env.URL + "/exercicios");
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
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

    // renovação do token
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
