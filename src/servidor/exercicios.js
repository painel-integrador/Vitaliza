import { buscarTodosExercicios } from "../bancoDeDados/exercicios";

export async function rotasExercicio(servidor, opts) {
  servidor.get("/exercicios", async (req, res) => {
    buscarTodosExercicios(req.contaid);
  });
  servidor.get("/exercicio/:id", async (req, res) => {});

  servidor.post("/exercicio", async (req, res) => {});

  servidor.delete("/exercicios", async (req, res) => {});
}
