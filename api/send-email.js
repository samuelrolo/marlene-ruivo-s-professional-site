export default async function handler(req, res) {
  // Garantir que apenas pedidos POST são aceites
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { name, email, phone, message, rating } = req.body;
  const apiKey = process.env.BREVO_API_KEY;

  // Verificar se a chave de API existe
  if (!apiKey) {
    return res.status(500).json({ 
      error: 'Configuração em falta', 
      details: 'A BREVO_API_KEY não está definida na Vercel.' 
    });
  }

  const isFeedback = rating !== undefined;
  const subject = isFeedback 
    ? `Avaliação (${rating} estrelas): ${name}`
    : `Contacto: ${name}`;

  const htmlBody = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #2C4A3E;">${isFeedback ? 'Nova Avaliação' : 'Nova Mensagem de Contacto'}</h2>
      <p><strong>Nome:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Telefone:</strong> ${phone}</p>` : ''}
      ${isFeedback ? `<p><strong>Avaliação:</strong> ${rating} / 5 estrelas</p>` : ''}
      <p><strong>Mensagem:</strong></p>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
        ${message.replace(/\n/g, '<br>')}
      </div>
    </div>
  `;

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: "Site Marlene Ruivo", email: "marleneruivonutricao@gmail.com" },
        to: [{ email: "marleneruivonutricao@gmail.com", name: "Marlene Ruivo" }],
        subject: subject,
        htmlContent: htmlBody,
        replyTo: { email: email, name: name }
      }),
    });

    const result = await response.json();

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(response.status).json({ 
        error: 'Erro na Brevo', 
        details: result 
      });
    }
  } catch (error) {
    return res.status(500).json({ 
      error: 'Erro interno no servidor', 
      details: error.message 
    });
  }
}
