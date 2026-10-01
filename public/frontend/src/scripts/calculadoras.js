function calcularCalorias(event) {
  event.preventDefault();

  const form = document.getElementById("formulario");
  const formData = new FormData(form);
  const dados = Object.fromEntries(formData);
  const resultado = document.getElementById("resultado");
  let calorias = 0;

  console.log(dados);
  // de 0 a 3
  if (dados.idade >= 0 || dados.idade <= 3) {
    if ((dados.genero = "Masculino")) {
      calorias = 59.512 * dados.massa - 30.4;
    } else {
      calorias = 58.317 * dados.massa - 31.1;
    }
  }
  // de 3 a 10
  if (dados.idade >= 4 || dados.idade <= 10) {
    if ((dados.genero = "Masculino")) {
      ((calorias = 22.706 * dados.massa - 504), 3);
    } else {
      ((calorias = 20.315 * dados.massa - 485), 9);
    }
  }
  // de 10 a 18
  if (dados.idade >= 0 || dados.idade <= 3) {
    if ((dados.genero = "Masculino")) {
      ((calorias = 17.686 * dados.massa - 658), 2);
    } else {
      ((calorias = 13.384 * dados.massa - 692), 6);
    }
  }
  // de 18 a 30
  if (dados.idade >= 0 || dados.idade <= 3) {
    if ((dados.genero = "Masculino")) {
      ((calorias = 15.057 * dados.massa - 692), 2);
    } else {
      ((calorias = 14.818 * dados.massa - 486), 6);
    }
  }
  // de 30 a 60
  if (dados.idade >= 0 || dados.idade <= 3) {
    if ((dados.genero = "Masculino")) {
      ((calorias = 11.472 * dados.massa - 873), 1);
    } else {
      ((calorias = 8.126 * dados.massa - 845), 6);
    }
  }
  // 60+
  if (dados.idade >= 0 || dados.idade <= 3) {
    if ((dados.genero = "Masculino")) {
      ((calorias = 11.711 * dados.massa - 587), 7);
    } else {
      ((calorias = 9.082 * dados.massa - 658), 5);
    }
  }

  resultado.innerText = calorias + " calorias";
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
  let imc = 0;
  let massaIdeal = 0;

  console.log(dados);

  imc = dados.massa / (dados.altura * dados.altura);

  massaIdeal = imc * (dados.altura * dados.altura)

  resultado.innerText = `Seu IMC é: ${imc.toFixed(2)}`;
}
