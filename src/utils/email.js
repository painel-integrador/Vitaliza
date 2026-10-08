import nodemailer from "nodemailer";

// Configuração atualizada com suporte forçado a IPv4 e timeouts
const emailer = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.EMAIL,
    pass: process.env.SMTP_GOOGLE_APP_KEY,
  },
  // Força o uso da família IPv4 (evita o erro ENETUNREACH em redes sem IPv6)
  family: 4,
  // Timeouts para evitar requisições presas em segundo plano
  connectionTimeout: 10000,
  greetingTimeout: 5000,
  socketTimeout: 10000,
});

function criarEmailCadastro() {
  let assunto = "Bem-vindo à Vitaliza!";
  let mensagem = `
      <h1>Bem vindo à Vitaliza!</h1>
      <p>Obrigado por se juntar a nós, esperamos que aproveite nossos serviços.</p>
    `;

  return { assunto, mensagem };
}

function criarEmailLogin() {
  let assunto = "Novo acesso detectado";
  let mensagem = `
      <h1>Novo acesso detectado!</h1>
      <p>Você fez um login na sua conta.</p>
    `;

  return { assunto, mensagem };
}

export async function enviarEmail(
  destinatario,
  nomeUsuario,
  emailUsuario,
  mensagem,
  tipoAcao,
) {
  let email;

  if (tipoAcao === "cadastro") {
    email = criarEmailCadastro();
  } else if (tipoAcao === "login") {
    email = criarEmailLogin();
  } else if (tipoAcao === "contato") {
    email = {
      assunto: `Mensagem de usuário: ${nomeUsuario} - ${emailUsuario}`,
      mensagem,
    };
  }

  const mailOptions = {
    from: process.env.EMAIL || "vitaliza.pi@gmail.com",
    to: destinatario,
    subject: email.assunto,
    html: email.mensagem,
  };

  try {
    const info = await emailer.sendMail(mailOptions);
    console.log("Email enviado: " + email.assunto + " " + info.messageId);
  } catch (erro) {
    console.error("Erro ao enviar e-mail:", erro);
  }
}
