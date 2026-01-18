
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Campos obrigatórios em falta' });
  }

  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  
  if (!BREVO_API_KEY) {
    console.error('BREVO_API_KEY não configurada nas variáveis de ambiente');
    return res.status(500).json({ error: 'Configuração de email em falta' });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: "Site Marlene Ruivo", email: "marleneruivonutricao@gmail.com" },
        to: [{ email: "marleneruivonutricao@gmail.com", name: "Marlene Ruivo" }],
        replyTo: { email: email, name: name },
        subject: `Novo Contacto do Site: ${name}`,
        htmlContent: `
          <h3>Novo contacto recebido através do site marleneruivo.pt</h3>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Telefone:</strong> ${phone || 'Não fornecido'}</p>
          <p><strong>Mensagem:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({ success: true, messageId: data.messageId });
    } else {
      console.error('Erro na API da Brevo:', data);
      return res.status(response.status).json({ error: 'Erro ao enviar email via Brevo', details: data });
    }
  } catch (error) {
    console.error('Erro no servidor de email:', error);
    return res.status(500).json({ error: 'Erro interno ao processar o envio de email' });
  }
}
