import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function enviarEmail(
  destinatario,
  nomeUsuario,
  emailUsuario,
  mensagem,
  tipoAcao,
) {
  let assunto = "";
  let html = "";

  if (tipoAcao === "contato") {
    assunto = `Mensagem de usuário: ${nomeUsuario} - ${emailUsuario}`;
    html = `<p>${mensagem}</p>`;
  }

  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev", // Domínio de testes padrão do Resend
      to: destinatario,
      subject: assunto,
      html: html,
    });
    console.log("Email enviado com sucesso via Resend:", data);
  } catch (erro) {
    console.error("Erro ao enviar e-mail via API Resend:", erro);
  }
}
