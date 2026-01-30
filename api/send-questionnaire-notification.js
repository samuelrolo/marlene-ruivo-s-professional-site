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
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FDFCFB;">
      <div style="background-color: #6FA89E; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Novo Questionário Disponível</h1>
      </div>
      
      <div style="background-color: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <p style="color: #2C4A3E; font-size: 16px; line-height: 1.6;">
          Olá <strong>${patientName}</strong>,
        </p>
        
        <p style="color: #555; font-size: 15px; line-height: 1.6;">
          Foi-lhe atribuído um novo questionário para preencher na sua área pessoal:
        </p>
        
        <div style="background-color: #F5F9F8; padding: 20px; border-left: 4px solid #6FA89E; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; color: #2C4A3E; font-size: 18px; font-weight: bold;">
            📋 ${questionnaireName}
          </p>
          ${deadline ? `
            <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">
              <strong>Prazo:</strong> ${new Date(deadline).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          ` : ''}
        </div>
        
        ${notes ? `
          <div style="background-color: #FFF9F0; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; color: #2C4A3E; font-weight: bold; font-size: 14px;">
              💬 Nota da Nutricionista:
            </p>
            <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.5;">
              ${notes}
            </p>
          </div>
        ` : ''}
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://marleneruivo.pt/dashboard/questionarios" 
             style="display: inline-block; background-color: #6FA89E; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            Aceder à Área Pessoal
          </a>
        </div>
        
        <div style="background-color: #F8F8F8; padding: 15px; border-radius: 8px; margin-top: 20px;">
          <p style="margin: 0; color: #666; font-size: 13px; line-height: 1.5;">
            <strong>Como responder:</strong><br>
            1. Clique no botão acima ou aceda a <a href="https://marleneruivo.pt/dashboard" style="color: #6FA89E;">marleneruivo.pt/dashboard</a><br>
            2. Faça login com o seu email<br>
            3. Na secção "Os Meus Questionários", encontrará o questionário disponível<br>
            4. Clique em "Responder" e preencha todas as questões
          </p>
        </div>
        
        <p style="color: #999; font-size: 13px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          Se tiver alguma dúvida, não hesite em contactar-nos.<br>
          <strong>Dra. Marlene Ruivo</strong><br>
          Nutricionista | Especialista em Nutrição Funcional e Dieta FODMAP
        </p>
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
