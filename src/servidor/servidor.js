import Fastify from "fastify";
import { rotasAuth } from "./auth.js";
import fastifyCookie from "@fastify/cookie";

const servidor = Fastify({
  logger: true,
});

await servidor.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET,
});

servidor.get("/", async (req, res) => {
  res.status(200).send({
    nome: "Timóteo",
    msg: "Olá Mundo",
  });
});

servidor.register(rotasAuth, { prefix: "/api/auth" });

export default servidor;
