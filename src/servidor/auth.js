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
  "http://localhost:3000/api/auth/google/callback"
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
    maxAge: 7 * 24 * 60 * 60,
    sameSite: "lax",
  });

  res.setCookie("refresh_token", refreshToken, {
    path: "/auth/refresh",
    httpOnly: true,
    secure: process.env.ENV === "producao",
    maxAge: 7 * 24 * 60 * 60,
    sameSite: "strict",
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

      let contaBanco = await buscarContaPorEmail(payload.email);

      let contaCriada;

      // conta nao encontrada nem conexao com google, cria conta e conexao
      if (!contaBanco) {
        const conexaoGoogle = await criarConexaoGoogle({
          google_id: payload.sub,
          access_token: tokens.tokens.access_token,
          refresh_token: tokens.tokens.refresh_token,
          expira_em: new Date(tokens.tokens.expiry_date),
        });

        contaCriada = await criarConta({
          email: payload.email,
          conexao_google_id: conexaoGoogle.id,
        });

        await criarSessaoCookie(req, res, contaCriada.id);

        return res.redirect(process.env.URL + "/exercicios");
      } /* conta encontrada mas sem conexao com google, cria conexao */ else if (
        !contaBanco.conexao_google_id
      ) {
        const conexaoGoogle = await criarConexaoGoogle({
          google_id: payload.sub,
          access_token: tokens.tokens.access_token,
          refresh_token: tokens.tokens.refresh_token,
          expira_em: new Date(tokens.tokens.expiry_date),
        });

        contaCriada = await conectarGoogleNaConta(
          contaBanco.id,
          conexaoGoogle.id
        );

        await criarSessaoCookie(req, res, contaCriada.id);

        return res.redirect(process.env.URL + "/exercicios");
      } /* conta encontrada e conexao com google pronta, só cria a sessao */ else {
        await criarSessaoCookie(req, res, contaCriada.id);

        return res.redirect(process.env.URL + "/exercicios");
      }
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
      return res.status(401).send("Token de acesso ausente");
    }

    const sessao = await buscarSessaoPorToken(accessToken);
    const horaAtual = new Date(); // Declarado ANTES de comparar as datas

    const tokenAcessoExpirou =
      new Date(sessao?.access_token_expira_em) < horaAtual;
    const tokenRefreshExpirou =
      new Date(sessao?.refresh_token_expira_em) < horaAtual;

    if (!sessao || (tokenAcessoExpirou && tokenRefreshExpirou)) {
      return res.status(401).send("Sessão não encontrada ou expirada");
    }

    // Gerar novos tokens caso o access token tenha expirado, mas o refresh token ainda seja válido
    if (tokenAcessoExpirou && !tokenRefreshExpirou) {
      const { expiraEmDuasHoras, accessToken: novoAccessToken } =
        criarAccessToken();
      const { expiraEmDoisMeses, refreshToken: novoRefreshToken } =
        criarRefreshToken();

      res.setCookie("access_token", novoAccessToken, {
        path: "/",
        httpOnly: true,
        secure: process.env.ENV === "producao",
        maxAge: 7 * 24 * 60 * 60,
        sameSite: "lax",
      });

      res.setCookie("refresh_token", novoRefreshToken, {
        path: "/auth/refresh",
        httpOnly: true,
        secure: process.env.ENV === "producao",
        maxAge: 7 * 24 * 60 * 60,
        sameSite: "strict",
      });

      await atualizarTokens(
        sessao.id,
        novoAccessToken,
        novoRefreshToken,
        expiraEmDuasHoras,
        expiraEmDoisMeses
      );
    }
  } catch (erro) {
    console.error(erro);
    return res.status(500).send({ erro });
  }
}
