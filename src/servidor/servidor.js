import Fastify from "fastify";
import { rotasAuth } from "./auth.js";
import fastifyCookie from "@fastify/cookie";
import fastifyStatic from "@fastify/static";
import "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const servidor = Fastify({
  logger: true,
});

servidor.register(fastifyStatic, {
  root: path.join(__dirname, "../../public/frontend/pages/"),
  prefix: "/",
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
