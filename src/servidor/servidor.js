import Fastify from "fastify";
import { rotasAuth } from "./auth.js";
import fastifyCookie from "@fastify/cookie";
import fastifyStatic from "@fastify/static";
import "path";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { rateLimit } from "./rateLimit.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const servidor = Fastify({
  logger: true,
});

servidor.addHook("onRequest", rateLimit);

servidor.register(fastifyStatic, {
  root: path.join(__dirname, "../../public/frontend/"),
  prefix: "/",
});

await servidor.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET,
});

servidor.register(rotasAuth, { prefix: "/api/auth" });

// localhost:3000/

export default servidor;
