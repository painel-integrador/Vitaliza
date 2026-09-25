import fastifyStatic from "@fastify/static";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function rotasPaginas(servidor, opts) {
  servidor.register(fastifyStatic, {
    root: path.join(__dirname, "../../public/frontend/"),
  });

  servidor.get("/", async (req, res) => {
    return res.sendFile("index.html");
  });

  servidor.get("/sobre", async (req, res) => {
    return res.sendFile("sobre.html");
  });

  servidor.get("/artigos", async (req, res) => {
    return res.sendFile("artigos-home.html");
  });
  servidor.get("/artigos/exercicios", async (req, res) => {
    return res.sendFile("artigos-exercicios.html");
  });
  servidor.get("/artigos/suplementos", async (req, res) => {
    return res.sendFile("artigos-suplementos.html");
  });
  servidor.get("/artigos/hidratacao", async (req, res) => {
    return res.sendFile("artigos-hidratacao.html");
  });
  servidor.get("/artigos/alongamento", async (req, res) => {
    return res.sendFile("artigos-alongamento.html");
  });

  servidor.get("/conta", async (req, res) => {
    return res.sendFile("conta-criar-conta.html");
  });
  servidor.get("/conta/login", async (req, res) => {
    return res.sendFile("conta-login.html");
  });
  servidor.get("/conta/criar-usuario", async (req, res) => {
    return res.sendFile("conta-criar-usuario.html");
  });
  servidor.get("/conta/usuario/me", async (req, res) => {
    return res.sendFile("conta-usuario-me.html");
  });
  servidor.get("/conta/usuario/:id", async (req, res) => {
    return res.sendFile("conta-usuario-id.html");
  });

  servidor.get("/calculadoras", async (req, res) => {
    return res.sendFile("calculadoras.html");
  });
  servidor.get("/calculadoras/imc", async (req, res) => {
    return res.sendFile("calculadoras-imc.html");
  });
  servidor.get("/calculadoras/calorias", async (req, res) => {
    return res.sendFile("calculadoras-calorias.html");
  });
  servidor.get("/calculadoras/massa-ideal", async (req, res) => {
    return res.sendFile("calculadoras-massa-ideal.html");
  });

  servidor.get("/home", async (req, res) => {
    return res.sendFile("home.html");
  });
  servidor.get("/exercicios/vizualizar", async (req, res) => {
    return res.sendFile("exercicios-vizualizar.html");
  });
  servidor.get("/exercicios/criar-exercicio", async (req, res) => {
    return res.sendFile("exercicios-criar-exercicio.html");
  });

  servidor.get("/rotinas", async (req, res) => {
    return res.sendFile("rotinas-vizualizar.html");
  });
  servidor.get("/rotinas/:id", async (req, res) => {
    return res.sendFile("rotinas-vizualizar-id.html");
  });
  servidor.get("/rotinas/criar-rotina", async (req, res) => {
    return res.sendFile("rotinas-criar-rotina.html");
  });

  servidor.get("/hidratacao/registrar", async (req, res) => {
    return res.sendFile("hidratacao-registrar.html");
  });
  servidor.get("/hidratacao/vizualizar/:dia/:mes/:ano", async (req, res) => {
    return res.sendFile("hidratacao-vizualizar-dia-mes-ano.html");
  });
}
