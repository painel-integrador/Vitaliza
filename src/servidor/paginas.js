import fastifyStatic from "@fastify/static";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { autenticar } from "./auth.js";

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

  servidor.get("/contato", async (req, res) => {
    return res.sendFile("contato.html");
  });

  servidor.get("/informativo", async (req, res) => {
    return res.sendFile("informativo/home.html");
  });

  servidor.get("/informativo/funcionalidades", async (req, res) => {
    return res.sendFile("informativo/funcionalidades.html");
  });

  servidor.get("/informativo/exercicios", async (req, res) => {
    return res.sendFile("informativo/exercicios.html");
  });

  servidor.get("/informativo/hidratacao", async (req, res) => {
    return res.sendFile("informativo/hidratacao.html");
  });

  servidor.get("/informativo/alongamento", async (req, res) => {
    return res.sendFile("informativo/alongamento.html");
  });

  servidor.get("/informativo/suplementos", async (req, res) => {
    return res.sendFile("informativo/suplementos.html");
  });

  servidor.get("/artigos", async (req, res) => {
    return res.sendFile("informativo/home.html");
  });

  servidor.get("/conta", async (req, res) => {
    return res.sendFile("conta/conta-criar-conta.html");
  });

  servidor.get("/conta/criar-conta", async (req, res) => {
    return res.sendFile("conta/conta-criar-conta.html");
  });

  servidor.get("/conta/login", async (req, res) => {
    return res.sendFile("conta/conta-login.html");
  });

  servidor.get(
    "/conta/criar-usuario",
    { preHandler: [autenticar] },
    async (req, res) => {
      return res.sendFile("conta/conta-criar-usuario.html");
    },
  );

  servidor.get(
    "/conta/usuario/me",
    { preHandler: [autenticar] },
    async (req, res) => {
      return res.sendFile("conta/conta-usuario-me.html");
    },
  );

  servidor.get(
    "/conta/usuario/:id",
    { preHandler: [autenticar] },
    async (req, res) => {
      return res.sendFile("conta/conta-usuario-id.html");
    },
  );

  servidor.get("/calculadoras", async (req, res) => {
    return res.sendFile("calculadoras/calculadoras.html");
  });

  servidor.get("/calculadoras/imc", async (req, res) => {
    return res.sendFile("calculadoras/calculadoras-imc.html");
  });

  servidor.get("/calculadoras/calorias", async (req, res) => {
    return res.sendFile("calculadoras/calculadoras-calorias.html");
  });

  servidor.get("/calculadoras/massa", async (req, res) => {
    return res.sendFile("calculadoras/calculadoras-massa-ideal.html");
  });

  servidor.get("/painel", { preHandler: [autenticar] }, async (req, res) => {
    return res.sendFile("painel/home.html");
  });

  servidor.get("/erro/401", async (req, res) => {
    return res.sendFile("errors/error-401.html");
  });

  servidor.get("/erro/500", async (req, res) => {
    return res.sendFile("errors/error-500.html");
  });

  servidor.get("/erro/404", async (req, res) => {
    return res.sendFile("errors/error-404.html");
  });

  servidor.get("/elementos", async (req, res) => {
    return res.sendFile("elementos-novos.html");
  });
}
