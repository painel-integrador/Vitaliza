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
  servidor.get("/conta/perfil", async (req, res) => {
    return res.sendFile("conta-perfil.html");
  });
  servidor.get("/conta/criar-usuario", async (req, res) => {
    return res.sendFile("conta-criar-usuario.html");
  });
  servidor.get("/exercicios", async (req, res) => {
    return res.sendFile("exercicios-home.html");
  });
  servidor.get("/exercicios/vizualizar", async (req, res) => {
    return res.sendFile("exercicios-vizualizar.html");
  });
  servidor.get("/exercicios/criar-exercicio", async (req, res) => {
    return res.sendFile("exercicios-criar-exercicio.html");
  });
  servidor.get("/hidratacao", async (req, res) => {
    return res.sendFile("hidratacao-registrar.html");
  });
}
