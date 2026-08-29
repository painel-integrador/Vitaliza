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

  servidor.get("/artigos/hidratacao", async (req, res) => {
    return res.sendFile("../../public/frontend/hidratacao.html");
  });
  servidor.get("/conta/", async (req, res) => {
    return res.sendFile("../../public/frontend/hidratacao.html");
  });
}
