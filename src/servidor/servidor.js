import Fastify from "fastify";
import { rotasAuth } from "./auth.js";
import fastifyCookie from "@fastify/cookie";
import { rateLimit } from "./rateLimit.js";
import { rotasTreino } from "./treinos.js";
import { rotasPaginas } from "./paginas.js";
import { rotasGrupo } from "./grupos.js";
import { rotasHidratacao } from "./hidratacao.js";
import { rotasRotinas } from "./rotinas.js"

const servidor = Fastify({
  logger: true,
});

if (process.env.ENV === "producao") {
  servidor.addHook("onRequest", rateLimit);
}

await servidor.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET,
});

servidor.register(rotasPaginas, { prefix: "/" });
servidor.register(rotasAuth, { prefix: "/api/auth" });
servidor.register(rotasTreino, { prefix: "/api/treinos" });
servidor.register(rotasGrupo, { prefix: "/api/grupos" });
servidor.register(rotasHidratacao, { prefix: "/api/hidratacao" });
servidor.register(rotasRotinas, { prefix: "/api/rotinas" })
// localhost:3000/
export default servidor;
