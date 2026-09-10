function criarConta(event) {
  event.preventDefault(); // Impede o recarregamento da página
  const form = document.getElementById("meuFormulario");

  // Instancia o FormData passando o elemento form
  const formData = new FormData(form);

  // Converte os dados em um objeto JavaScript simples
  const dados = Object.fromEntries(formData);
}
