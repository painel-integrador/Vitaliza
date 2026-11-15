import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import rateLimit from "@fastify/rate-limit";
import helmet from "@fastify/helmet"; // header pra segurança

import { rotasAuth } from "./auth.js";
import { rotasTreino } from "./treinos.js";
import { rotasPaginas } from "./paginas.js";
import { rotasGrupo } from "./grupos.js";
import { rotasHidratacao } from "./hidratacao.js";
import { rotasRotinas } from "./rotinas.js";
import { rotasMensagens } from "./contato.js";
import { rotasUsuario } from "./usuarios.js";

const servidor = Fastify({
  logger: true,
  trustProxy: true,
  connectionTimeout: 10000, // encerra conexão após 10 segundos se travar
});

await servidor.register(rateLimit, {
  max: 80,
  timeWindow: "1 minute",
});

await servidor.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET,
});

await servidor.register(helmet);

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
