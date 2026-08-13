import { hash, compare } from "bcrypt";
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
  servidor.post("/criar_conta_email_senha", async (req, res) => {
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

  servidor.post("/login_email_senha", async (req, res) => {
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
}

export async function autenticar(req, res) {
  try {
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
      return res.status(401).send("Token de acesso ausente");
    }

    const sessao = await buscarSessaoPorToken(accessToken);
    const horaAtual = new Date(); // Declarado ANTES de comparar as datas

    const tokenAcessoExpirou = new Date(sessao?.access_token_expira_em) < horaAtual;
    const tokenRefreshExpirou = new Date(sessao?.refresh_token_expira_em) < horaAtual;

    if (!sessao || (tokenAcessoExpirou && tokenRefreshExpirou)) {
      return res.status(401).send("Sessão não encontrada ou expirada");
    }

    // Gerar novos tokens caso o access token tenha expirado, mas o refresh token ainda seja válido
    if (tokenAcessoExpirou && !tokenRefreshExpirou) {
      const { expiraEmDuasHoras, accessToken: novoAccessToken } = criarAccessToken();
      const { expiraEmDoisMeses, refreshToken: novoRefreshToken } = criarRefreshToken();

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
        expiraEmDoisMeses,
      );
    }
  } catch (erro) {
    console.error(erro);
    return res.status(500).send({ erro });
  }
}
