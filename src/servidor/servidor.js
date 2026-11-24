import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import rateLimit from "@fastify/rate-limit";
import fastifyStatic from "@fastify/static";
import scalarApiReference from "@scalar/fastify-api-reference";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { rotasAuth } from "./auth.js";
import { rotasTreino } from "./treinos.js";
import { rotasPaginas } from "./paginas.js";
import { rotasGrupo } from "./grupos.js";
import { rotasHidratacao } from "./hidratacao.js";
import { rotasRotinas } from "./rotinas.js";
import { rotasMensagens } from "./contato.js";
import { rotasUsuario } from "./usuarios.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const servidor = Fastify({
  logger: true,
  trustProxy: true,
  connectionTimeout: 10000, // encerra conexão após 10 segundos se travar
});

await servidor.register(rateLimit, {
  max: 350,
  timeWindow: "1 minute",
});

await servidor.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET,
});

await servidor.register(fastifyStatic, {
  root: path.join(__dirname, "../../docs"),
  prefix: "/docs/",
  decorateReply: false,
  index: false,
});

await servidor.register(scalarApiReference, {
  routePrefix: "/docs",
  configuration: {
    url: "/docs/openapi.json",
  },
});

servidor.addHook("onSend", async (req, res, payload) => {
  if (res.statusCode === 404 && req.url !== "/erro/404") {
    res.code(302);
    res.header("location", "/erro/404");
  }

  return payload;
});

servidor.register(rotasPaginas, { prefix: "/" });
servidor.register(rotasAuth, { prefix: "/api/auth" });
servidor.register(rotasTreino, { prefix: "/api/treinos" });
servidor.register(rotasGrupo, { prefix: "/api/grupos" });
servidor.register(rotasHidratacao, { prefix: "/api/hidratacao" });
servidor.register(rotasRotinas, { prefix: "/api/rotinas" });
servidor.register(rotasMensagens, { prefix: "/api/mensagem" });
servidor.register(rotasUsuario, { prefix: "/api/usuario" });

// localhost:3000/
export default servidor;
