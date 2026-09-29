async function enviarMensagem(event) {
  event.preventDefault();

  const form = document.getElementById("formulario");
  const formData = new FormData(form);
  const dados = Object.fromEntries(formData);

  try {
    const response = await fetch("/api/mensagem/mensagem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    if (!response.ok) {
      alert(`Erro na requisição: ${response.status}\n${response.body}`);
      throw new Error(
        `Erro na requisição: ${response.status}\n${response.body}`,
      );
    }

    document.getElementById("resultado").innerHTML =
      `Mensagem enviada, agradecemos o contato. <a href="/" class="link">Voltar ao início.</a>`;
  } catch (e) {
    console.log("Erro ao processar envio de mensagem:", e);
  }
}
