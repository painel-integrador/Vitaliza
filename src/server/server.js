import Fastify from "fastify";

export const app = Fastify({
  logger: true,
});

app.get("/", async (req, res) => {
  res.status(200).send({
    nome: "Timóteo",
    msg: "Olá Mundo",
  });
});
