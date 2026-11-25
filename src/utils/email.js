import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function enviarEmail(
  destinatario,
  nomeUsuario,
  emailUsuario,
  mensagem,
  tipoAcao, // diferentes envios de email, ex: criar conta
) {
  let assunto = "";
  let html = "";

  // cria o corpo e titulo do email
  if (tipoAcao === "contato") {
    assunto = `Mensagem de usuário: ${nomeUsuario} - ${emailUsuario}`;
    html = `<p>${mensagem}</p>`;
  }

  try {
    // envia o email
    const data = await resend.emails.send({
      from: "onboarding@resend.dev", // Domínio de testes padrão do Resend
      to: destinatario,
      subject: assunto,
      html: html,
    });

    if (data.error) {
      throw new Error(data.error.message);
    }

    console.log("Email enviado com sucesso via Resend:", data);
  } catch (erro) {
    console.error("Erro ao enviar e-mail via API Resend:", erro);
    throw erro;
  }
}
