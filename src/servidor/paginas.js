import fastifyStatic from "@fastify/static";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { autenticar } from "./auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function rotasPaginas(servidor, _) {
  servidor.register(fastifyStatic, {
    root: path.join(__dirname, "../../public/dist/"),
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
    return res.sendFile("informativo/index.html");
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

  servidor.get("/conta", async (req, res) => {
    return res.sendFile("conta/usuario.html");
  });

  servidor.get("/perfil", async (req, res) => {
    return res.sendFile("conta/usuario.html");
  });

  servidor.get("/conta/criar-conta", async (req, res) => {
    return res.sendFile("conta/criar-conta.html");
  });

  servidor.get("/conta/login", async (req, res) => {
    return res.sendFile("conta/login.html");
  });

  servidor.get(
    "/conta/criar-usuario",
    { preHandler: [autenticar] },
    async (req, res) => {
      return res.sendFile("conta/criar-usuario.html");
    },
  );

  servidor.get(
    "/conta/usuario/:id",
    { preHandler: [autenticar] },
    async (req, res) => {
      return res.sendFile("conta/usuario.html");
    },
  );

  servidor.get("/calculadoras", async (req, res) => {
    return res.sendFile("calculadoras/calculadoras.html");
  });

  servidor.get("/calculadoras/imc", async (req, res) => {
    return res.sendFile("calculadoras/imc.html");
  });

  servidor.get("/calculadoras/calorias", async (req, res) => {
    return res.sendFile("calculadoras/calorias.html");
  });

  servidor.get("/calculadoras/massa-ideal", async (req, res) => {
    return res.sendFile("calculadoras/massa-ideal.html");
  });

  servidor.get("/painel", { preHandler: [autenticar] }, async (req, res) => {
    return res.sendFile("painel/index.html");
  });

  servidor.get("/erro/401", async (req, res) => {
    return res.sendFile("erros/401.html");
  });

  servidor.get("/erro/500", async (req, res) => {
    return res.sendFile("erros/500.html");
  });

  servidor.get("/erro/404", async (req, res) => {
    return res.sendFile("erros/404.html");
  });
}
