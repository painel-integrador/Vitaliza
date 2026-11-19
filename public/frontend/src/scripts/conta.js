async function criarConta(event) {
  event.preventDefault();

  const form = document.getElementById("formulario");
  const formData = new FormData(form);
  const dados = Object.fromEntries(formData);

  if (dados.senha !== dados.confirmar) {
    const erroConta = document.getElementById("erro-conta");

    erroConta.innerHTML = `<strong>Erro: </strong>As senhas não são iguais.`;
    return;
  }

  if (dados.senha.length < 6) {
    const erroConta = document.getElementById("erro-conta");

    erroConta.innerHTML = `<strong>Erro: </strong>A senha deve ter pelo menos 6 caracteres.`;
    return;
  }

  if (!/[A-Z]/.test(dados.senha)) {
    const erroConta = document.getElementById("erro-conta");

    erroConta.innerHTML = `<strong>Erro: </strong>A senha deve conter pelo menos uma letra maiúscula.`;
    return;
  }

  if (!/[0-9]/.test(dados.senha)) {
    const erroConta = document.getElementById("erro-conta");

    erroConta.innerHTML = `<strong>Erro: </strong>A senha deve conter pelo menos um número.`;
    return;
  }

  try {
    const response = await fetch("/api/auth/criar_conta/email_senha", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    if (!response.ok) {
      const dadosErro = await response.json();
      if (response.status === 409) {
        const erroConta = document.getElementById("erro-conta");

        erroConta.innerHTML = `<strong>Erro: </strong>Conta já existente,
            <a href="/conta/login" class="centro link">faça login</a>`;
        return;
      }

      throw new Error(
        dadosErro.erro || `Erro na requisição: ${response.status}`,
      );
    }

    // Se o backend respondeu com redirect (302), a propriedade .url conterá o destino final
    if (response.redirected) {
      window.location.href = response.url;
    }
  } catch (e) {
    console.error("Erro ao processar criação de conta:", e);
  }
}

async function login(event) {
  event.preventDefault();

  const form = document.getElementById("formulario");
  const formData = new FormData(form);
  const dados = Object.fromEntries(formData);

  try {
    const response = await fetch("/api/auth/login/email_senha", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    if (!response.ok) {
      const dadosErro = await response.json();
      const erroLogin = document.getElementById("erro-login");
      if (response.status === 401) {
        erroLogin.innerHTML = `<strong>Erro: </strong>Conta não existe ou senha inválida,
            <a href="/conta/criar-conta" class="centro link">crie sua conta</a>`;
        return;
      }

      if (response.status === 401) {
        erroLogin.innerHTML = `<strong>Erro: </strong>Email ou senha inválidos`;
        return;
      }

      throw new Error(
        dadosErro.erro || `Erro na requisição: ${response.status}`,
      );
    }

    // Se o backend respondeu com redirect (302), a propriedade .url conterá o destino final
    if (response.redirected) {
      window.location.href = response.url;
    }
  } catch (e) {
    console.error("Erro ao processar login:", e);
  }
}

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
