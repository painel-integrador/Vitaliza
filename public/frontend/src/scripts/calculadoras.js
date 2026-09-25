function calcularCalorias(event) {
  event.preventDefault();

  const form = document.getElementById("formulario");
  const formData = new FormData(form);
  const dados = Object.fromEntries(formData);
  const resultado = document.getElementById("resultado");
  let calorias = 0;

  console.log(dados);

  if (dados.idade >= 0 || dados.idade <= 3) {
    if ((dados.genero = "Masculino")) {
      calorias = (59, 512 * dados.massa) - 30.4;
    } else {
      calorias = (58, 317 * dados.massa) - 31.1;
    }
  } else if (dados.idade >= 3 || dados.idade <= 10) {
  }

  resultado.innerText = calorias + " calorias";
}
