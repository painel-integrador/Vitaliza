async function criarUsuario(event) {
  event.preventDefault();

  const form = document.getElementById("formulario");
  const formData = new FormData(form);
  const dadosNaoFiltrados = Object.fromEntries(formData);

  const dados = Object.fromEntries(
    Object.entries(dadosNaoFiltrados).filter(([_, valor]) => valor !== ""),
  );

  dados.altura = Number(dados.altura).toFixed(2) * 100;
  dados.peso = Number(dados.peso).toFixed(2) * 1000;

  if (dados.objetivo_peso) {
    dados.objetivo_peso = Number(dados.objetivo_peso).toFixed(2) * 1000;
  }

  try {
    const response = await fetch("/api/usuario/usuario", {
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

    // Se o backend respondeu com redirect (302), a propriedade .url conterá o destino final
    if (response.redirected) {
      window.location.href = response.url;
    }
  } catch (e) {
    console.error("Erro ao processar criação de usuario:", e);
  }
}
