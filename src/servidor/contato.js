import { criarMensagem } from "../bancoDeDados/contato.js";
import { enviarEmail } from "../utils/email.js";

export async function rotasMensagens(servidor, opts) {
  servidor.post("/mensagem", async (req, res) => {
    try {
      const mensagem = await criarMensagem(req.body);
      await enviarEmail(
        "vitaliza.pi@gmail.com",
        req.body.nome,
        req.body.email,
        req.body.mensagem,
        "contato",
      );

      return res.status(201).send(mensagem);
    } catch (erro) {
      console.error(erro);
      return res.status(500).send({ erro });
    }
  });
}
