export default async function handler(req, res) {
  // Garantir que apenas pedidos POST são aceites
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { patientName, patientEmail, questionnaireName, deadline, notes } = req.body;
  const apiKey = process.env.BREVO_API_KEY;

  // Verificar se a chave de API existe
  if (!apiKey) {
    return res.status(500).json({ 
      error: 'Configuração em falta', 
      details: 'A BREVO_API_KEY não está definida na Vercel.' 
    });
  }

  // Validar dados obrigatórios
  if (!patientName || !patientEmail || !questionnaireName) {
    return res.status(400).json({ 
      error: 'Dados em falta', 
      details: 'Nome do paciente, email e nome do questionário são obrigatórios.' 
    });
  }

  const subject = `Novo Questionário Disponível: ${questionnaireName}`;

  const htmlBody = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #2C4A3E; max-width: 600px; margin: 0 auto; padding: 40px 20px; border: 1px solid #f0f0f0; border-radius: 24px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="https://marleneruivo.pt/assets/logo-marlene-ruivo.png" alt="Dra. Marlene Ruivo" style="height: 100px; width: auto;">
      </div>
      
      <h2 style="color: #6FA89E; text-align: center; font-size: 24px; margin-bottom: 20px; font-weight: 500;">Novo Questionário Disponível</h2>
      
      <p style="font-size: 16px; line-height: 1.6; color: #444;">Olá <strong>${patientName}</strong>,</p>
      <p style="font-size: 16px; line-height: 1.6; color: #444;">Espero que se encontre bem. Foi-lhe atribuído um novo questionário para preencher na sua área pessoal de paciente:</p>
      
      <div style="background-color: #FDFCFB; padding: 25px; border-radius: 20px; margin: 30px 0; border: 1px solid #6FA89E15; text-align: center;">
        <p style="margin: 0; color: #6FA89E; font-size: 20px; font-weight: 500;">📋 ${questionnaireName}</p>
        ${deadline ? `
          <p style="margin: 10px 0 0 0; color: #999; font-size: 13px; text-transform: uppercase; tracking: 1px;">
            Prazo de entrega: ${new Date(deadline).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
        ` : ''}
      </div>
      
      ${notes ? `
        <div style="background-color: #F9F9F9; padding: 20px; border-radius: 16px; margin: 20px 0; border: 1px solid #eee;">
          <p style="margin: 0 0 8px 0; color: #6FA89E; font-weight: 600; font-size: 14px; text-transform: uppercase; tracking: 1px;">Nota da Nutricionista:</p>
          <p style="margin: 0; color: #555; font-size: 15px; line-height: 1.6; font-style: italic;">"${notes}"</p>
        </div>
      ` : ''}
      
      <div style="text-align: center; margin: 40px 0;">
        <a href="https://marleneruivo.pt/dashboard/questionarios" 
           style="display: inline-block; background-color: #6FA89E; color: white; padding: 18px 40px; text-decoration: none; border-radius: 16px; font-weight: 600; font-size: 16px; shadow: 0 10px 20px rgba(111, 168, 158, 0.2); transition: all 0.3s ease;">
          Aceder à Área Pessoal
        </a>
      </div>
      
      <div style="background-color: #FDFCFB; padding: 20px; border-radius: 16px; border: 1px solid #eee; margin-top: 30px;">
        <p style="margin: 0; color: #888; font-size: 13px; line-height: 1.6;">
          <strong>Como responder:</strong><br>
          1. Clique no botão acima ou aceda a <a href="https://marleneruivo.pt/dashboard" style="color: #6FA89E; text-decoration: none;">marleneruivo.pt/dashboard</a><br>
          2. Faça login com o seu email de paciente<br>
          3. Na secção "Os Meus Questionários", clique em "Responder"
        </p>
      </div>
      
      <div style="margin-top: 50px; padding-top: 30px; border-top: 1px solid #f0f0f0;">
        <p style="margin: 0; font-size: 16px; font-weight: 600; color: #2C4A3E;">Dra. Marlene Ruivo</p>
        <p style="margin: 4px 0 20px 0; font-size: 14px; color: #6FA89E;">Nutricionista | Especialista em Saúde Intestinal</p>
        
        <div style="text-align: center; margin-top: 30px;">
          <p style="font-size: 10px; color: #ccc; text-transform: uppercase; letter-spacing: 2px;">© 2026 Dra. Marlene Ruivo • Nutrição Funcional</p>
        </div>
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
        sender: { 
          name: "Dra. Marlene Ruivo - Nutricionista", 
          email: "marleneruivonutricao@gmail.com" 
        },
        to: [{ 
          email: patientEmail, 
          name: patientName 
        }],
        subject: subject,
        htmlContent: htmlBody,
        replyTo: { 
          email: "marleneruivonutricao@gmail.com", 
          name: "Dra. Marlene Ruivo" 
        }
      }),
    });

    const result = await response.json();

    if (response.ok) {
      return res.status(200).json({ success: true, messageId: result.messageId });
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
