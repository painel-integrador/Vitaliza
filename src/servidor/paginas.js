export async function rotasPaginas(servidor, opts) {
  servidor.register(fastifyStatic, {
    root: path.join(__dirname, "../../public/frontend/"),
  });

  servidor.get("/", async (req, res) => {
    return res.sendFile("../../public/frontend/home.html");
  });
  servidor.get("/sobre", async (req, res) => {
    return res.sendFile("../../public/frontend/sobre.html");
  });

  servidor.get("/sobre", async (req, res) => {
    return res.sendFile("../../public/frontend/sobre.html");
  });
  servidor.get("/artigos", async (req, res) => {
    return res.sendFile("../../public/frontend/artigos-home.html");
  });
  servidor.get("/artigos/exercicios", async (req, res) => {
    return res.sendFile("../../public/frontend/artigos-exercicios.html");
  });
  servidor.get("/artigos/suplementos", async (req, res) => {
    return res.sendFile("../../public/frontend/artigos-suplementos.html");
  });
  servidor.get("/artigos/hidratacao", async (req, res) => {
    return res.sendFile("../../public/frontend/artigos-hidratacao.html");
  });
  servidor.get("/artigos/alongamento", async (req, res) => {
    return res.sendFile("../../public/frontend/artigos-alongamento.html");
  });
  servidor.get("/conta", async (req, res) => {
    return res.sendFile("../../public/frontend/conta-criar-conta.html");
  });
  servidor.get("/conta/login", async (req, res) => {
    return res.sendFile("../../public/frontend/conta-login.html");
  });
  servidor.get("/conta/perfil", async (req, res) => {
    return res.sendFile("../../public/frontend/conta-perfil.html");
  });
  servidor.get("/conta/criar-usuario", async (req, res) => {
    return res.sendFile("../../public/frontend/conta-criar-usuario.html");
  });
  servidor.get("/exercicios", async (req, res) => {
    return res.sendFile("../../public/frontend/exercicios-home.html");
  });
  servidor.get("/exercicios/vizualizar", async (req, res) => {
    return res.sendFile("../../public/frontend/exercicios-vizualizar.html");
  });
  servidor.get("/exercicios/criar-exercicio", async (req, res) => {
    return res.sendFile(
      "../../public/frontend/exercicios-criar-exercicio.html",
    );
  });
  servidor.get("/hidratacao", async (req, res) => {
    return res.sendFile("../../public/frontend/hidratacao-registrar.html");
  });
}
