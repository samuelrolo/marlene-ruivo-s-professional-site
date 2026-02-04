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
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #2C4A3E; max-width: 600px; margin: 0 auto; padding: 40px 20px; border: 1px solid #f0f0f0; border-radius: 24px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="https://marleneruivo.pt/assets/logo-marlene-ruivo.png" alt="Dra. Marlene Ruivo" style="height: 80px; width: auto;">
      </div>
      
      <h2 style="color: #6FA89E; text-align: center; font-size: 22px; margin-bottom: 20px; font-weight: 500;">${isFeedback ? 'Nova Avaliação Recebida' : 'Nova Mensagem de Contacto'}</h2>
      
      <div style="background-color: #FDFCFB; padding: 25px; border-radius: 20px; margin: 30px 0; border: 1px solid #6FA89E15;">
        <p style="margin: 0 0 15px 0; font-size: 14px; color: #666; border-bottom: 1px solid #eee; padding-bottom: 10px;"><strong>Detalhes do Remetente</strong></p>
        <p style="margin: 8px 0; font-size: 15px;"><strong>Nome:</strong> ${name}</p>
        <p style="margin: 8px 0; font-size: 15px;"><strong>Email:</strong> ${email}</p>
        ${phone ? `<p style="margin: 8px 0; font-size: 15px;"><strong>Telefone:</strong> ${phone}</p>` : ''}
        ${isFeedback ? `<p style="margin: 8px 0; font-size: 15px;"><strong>Avaliação:</strong> <span style="color: #FFB800;">${'★'.repeat(rating)}${'☆'.repeat(5-rating)}</span> (${rating}/5)</p>` : ''}
      </div>
      
      <p style="margin: 0 0 10px 0; font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Mensagem:</p>
      <div style="background: #F9F9F9; padding: 20px; border-radius: 16px; font-size: 15px; line-height: 1.6; color: #444; border: 1px solid #eee;">
        ${message.replace(/\n/g, '<br>')}
      </div>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f0f0f0; text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 2px;">Notificação Automática • marleneruivo.pt</p>
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
