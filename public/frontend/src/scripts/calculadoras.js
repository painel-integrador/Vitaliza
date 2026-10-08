function calcularCalorias(event) {
  event.preventDefault();

  const form = document.getElementById("formulario");
  const formData = new FormData(form);
  const dados = Object.fromEntries(formData);
  const resultado = document.getElementById("resultado");

  console.log(dados);

  // Convertendo os dados necessários para números
  let massa = Number(dados.massa);

  let altura = Number(dados.altura);
  altura = altura * 100;

  let idade = Number(dados.idade);

  let calorias = 0;
  let tmb = 0;

  // Calcular taxa metabólica basal (TMB)
  if (dados.genero === "masculino") {
    tmb = 10 * massa + 6.25 * altura - 5 * idade + 5;
  } else {
    tmb = 10 * massa + 6.25 * altura - 5 * idade - 161;
  }

  // Calcular atividade diária
  switch (dados.atividade) {
    case "sedentario":
      calorias = tmb * 1.2;
      break;

    case "levemente":
      calorias = tmb * 1.375;
      break;

    case "moderado":
      calorias = tmb * 1.55;
      break;

    case "muito":
      calorias = tmb * 1.725;
      break;

    case "extremo":
      calorias = tmb * 1.9;
      break;
  }

  resultado.innerHTML = `
    <p class="txt-centro">Seu gasto calórico diário deve ser por volta de: <strong>${calorias.toFixed(0)} calorias</strong></p>
    <p class="txt-centro">Sua taxa metabólica basal é: <strong>${tmb.toFixed(0)} calorias</strong></p>
  `;
}

function calcularIMC(event) {
  event.preventDefault();

  const form = document.getElementById("formulario");
  const formData = new FormData(form);
  const dados = Object.fromEntries(formData);
  const resultado = document.getElementById("resultado");
  let imc = 0;

  console.log(dados);

  imc = dados.massa / (dados.altura * dados.altura);

  resultado.innerText = `Seu IMC é: ${imc.toFixed(2)}`;
}

function calcularMassaIdeal(event) {
  event.preventDefault();

  const form = document.getElementById("formulario");
  const formData = new FormData(form);
  const dados = Object.fromEntries(formData);
  const resultado = document.getElementById("resultado");

  console.log(dados);

  let alturaEmCm = Number(dados.altura) * 100;
  let massaIdeal = 0;

  // Cálculo pela Fórmula de Devine
  if (dados.genero === "masculino") {
    massaIdeal = 50 + 2.3 * (alturaEmCm / 2.54 - 60);
  } else {
    massaIdeal = 45.5 + 2.3 * (alturaEmCm / 2.54 - 60);
  }

  resultado.innerHTML = `
    <p class="txt-centro">Sua massa ideal estimada é de aproximadamente: <strong>${massaIdeal.toFixed(1)} kg</strong></p>
  `;
}
