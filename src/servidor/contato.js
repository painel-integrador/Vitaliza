import { criarMensagem } from "../bancoDeDados/contato.js";

export async function rotasMensagens(servidor, opts) {
  servidor.post("/mensagem", async (req, res) => {
    try {
      const mensagem = await criarMensagem(req.body);

      return res.status(201).send(mensagem);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });
}
