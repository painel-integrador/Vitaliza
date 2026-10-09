async function enviarMensagem(event) {
  event.preventDefault();

  const form = document.getElementById("formulario");
  const formData = new FormData(form);
  const dados = Object.fromEntries(formData);
  const botaoEnviar = document.getElementById("botao-enviar");

  try {
    botaoEnviar.classList.toggle("invisivel");
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

    if (response.redirected) {
      window.location.href = response.url;
    }
  } catch (e) {
    console.log("Erro ao processar envio de mensagem:", e);
  }
}
