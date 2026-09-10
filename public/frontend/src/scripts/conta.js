async function criarConta(event) {
  event.preventDefault(); // Impede o recarregamento da página

  const form = document.getElementById("formulario");
  const formData = new FormData(form);

  // Converte os dados em um objeto JavaScript simples
  const dados = Object.fromEntries(formData);

  try {
    const response = await fetch("/api/auth/criar_conta/email_senha", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    if (!response.ok) {
      throw new Error(`Erro no servidor: ${response.status}\n${response.text}`);
    }

    const resultado = await response.json(); // Processa a resposta do servidor
    console.log("Sucesso! Dados retornados:", resultado);
  } catch (e) {}
}
