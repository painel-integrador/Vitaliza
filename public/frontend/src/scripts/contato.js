async function enviarMensagem(event) {
  event.preventDefault();

  const form = document.getElementById("formulario");
  const formData = new FormData(form);
  const dados = Object.fromEntries(formData);
  const botaoEnviar = document.getElementById("botao-enviar");

  botaoEnviar.classList.add("invisivel");

  try {
    const response = await fetch("/api/mensagem/mensagem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    // se responder sem ser 200
    if (!response.ok) {
      const dadosErro = await response.json();
      alert(dadosErro.erro || `Erro na requisição: ${response.status}`);
      throw new Error(
        dadosErro.erro || `Erro na requisição: ${response.status}`,
      );
    }

    if (response.redirected) {
      window.location.href = response.url;
    } else {
      window.location.href = "/";
    }
  } catch (e) {
    console.log("Erro ao processar envio de mensagem:", e);
  }
}
