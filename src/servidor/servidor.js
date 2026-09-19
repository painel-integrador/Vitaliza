import Fastify from "fastify";
import { rotasAuth } from "./auth.js";
import fastifyCookie from "@fastify/cookie";
import { rateLimit } from "./rateLimit.js";
import { rotasTreino } from "./treinos.js";
import { rotasPaginas } from "./paginas.js";

const servidor = Fastify({
  logger: true,
});

servidor.addHook("onRequest", rateLimit);

await servidor.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET,
});

servidor.register(rotasPaginas, { prefix: "/" });
servidor.register(rotasAuth, { prefix: "/api/auth" });
servidor.register(rotasTreino, { prefix: "/api" });

// localhost:3000/

export default servidor;
