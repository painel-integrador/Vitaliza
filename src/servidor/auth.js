import { hash } from "bcrypt";
import { buscarContaPorEmail, criarConta } from "../bancoDeDados/contas.js";
import { criarSessao, buscarSessaoPorToken } from "../bancoDeDados/sessoes.js";
import crypto from "crypto";

/* Função de criação de sessão que salva nos cookies */
async function criarSessao(req, res, contaId) {
  // token
  const token = crypto.randomBytes(32).toString("hex");

  // tempo de exp
  const seteDiasEmMilissegundos = 7 * 24 * 60 * 60 * 1000;
  const expiraEm = new Date(Date.now() + seteDiasEmMilissegundos);

  // pegar os dados
  const userAgent = req.headers["user-agent"];
  const enderecoIp = req.ip;

  await criarSessao({
    token,
    expira_em: expiraEm,
    endereco_ip: enderecoIp,
    user_agent: userAgent,
    conta_id: contaId,
  });

  res.setCookie("session_id", token, {
    path: "/",
    httpOnly: true,
    secure: process.env.ENV === "producao",
    maxAge: 7 * 24 * 60 * 60, // tempo de vida do cookie
    sameSite: "lax",
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
