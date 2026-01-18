
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phoneNumber, amount, email } = req.body;
  
  const mbWayKey = process.env.MBWAYKEY || 'BCS-378163';
  const BREVO_API_KEY = process.env.BREVO_API_KEY;

  console.log('Iniciando pedido MB WAY para:', phoneNumber, 'Valor:', amount);

  if (!phoneNumber || !amount) {
    return res.status(400).json({ error: 'Dados em falta: Telemóvel e Valor são obrigatórios.' });
  }

  try {
    const ifthenUrl = 'https://mbway.ifthenpay.com/ifthenpaymbw.asmx/SetPedidoJSON';
    const orderId = 'MR' + Date.now();

    const params = new URLSearchParams();
    params.append('MbWayKey', mbWayKey);
    params.append('canal', '03');
    params.append('referencia', orderId);
    params.append('valor', amount);
    params.append('nrtlm', phoneNumber);
    params.append('email', email || '');
    params.append('descricao', 'Consulta Nutricao');

    const ifthenResponse = await fetch(ifthenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const data = await ifthenResponse.json();
    console.log('Resposta IFThenPay:', data);

    if ((data.Estado === '000' || data.Estado === '0') && email && BREVO_API_KEY) {
      try {
        console.log('Enviando email de confirmação via Brevo...');
        const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'api-key': BREVO_API_KEY,
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            sender: { name: "Dra. Marlene Ruivo", email: "marleneruivonutricao@gmail.com" },
            to: [{ email: email }],
            bcc: [{ email: "marleneruivonutricao@gmail.com" }],
            subject: "Confirmação de Pedido de Agendamento - Dra. Marlene Ruivo",
            htmlContent: `
              <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #2C4A3E; max-width: 600px; margin: 0 auto; padding: 40px 20px; border: 1px solid #f0f0f0; border-radius: 24px; background-color: #ffffff;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <img src="https://marleneruivo.pt/assets/logo-marlene-ruivo.png" alt="Dra. Marlene Ruivo" style="height: 120px; width: auto;">
                </div>
                
                <h2 style="color: #6FA89E; text-align: center; font-size: 24px; margin-bottom: 20px;">Confirmação de Pedido</h2>
                
                <p style="font-size: 16px; line-height: 1.6;">Olá,</p>
                <p style="font-size: 16px; line-height: 1.6;">Este email confirma a receção do pedido de agendamento para a consulta de nutrição.</p>
                
                <div style="background-color: #FDFCFB; padding: 25px; border-radius: 20px; margin: 30px 0; border: 1px solid #6FA89E15;">
                  <p style="margin: 0 0 10px 0; font-size: 14px; color: #666; text-transform: uppercase; tracking: 1px;">Detalhes do Pagamento</p>
                  <p style="margin: 5px 0; font-size: 18px;"><strong>Valor:</strong> ${amount}€</p>
                  <p style="margin: 5px 0; font-size: 16px;"><strong>Método:</strong> MB WAY (${phoneNumber})</p>
                  <p style="margin: 5px 0; font-size: 14px; color: #999;"><strong>Referência:</strong> ${orderId}</p>
                </div>
                
                <p style="font-size: 15px; line-height: 1.6; color: #444;">Para concluir o processo, basta validar a notificação na aplicação MB WAY no telemóvel. Após a confirmação do pagamento, a vaga no calendário fica garantida de forma automática.</p>
                
                <p style="font-size: 15px; line-height: 1.6; color: #444;">Caso surja alguma dúvida ou dificuldade, basta responder a este email ou contactar através do número <strong>915 089 256</strong>.</p>
                
                <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #f0f0f0;">
                  <p style="margin: 0; font-size: 16px; font-weight: bold; color: #2C4A3E;">Dra. Marlene Ruivo</p>
                  <p style="margin: 4px 0 20px 0; font-size: 14px; color: #6FA89E;">Nutricionista</p>
                  
                  <div style="margin-bottom: 20px;">
                    <a href="https://marleneruivo.pt" style="color: #6FA89E; text-decoration: none; font-size: 14px; margin-right: 15px;">www.marleneruivo.pt</a>
                  </div>
                  
                  <div>
                    <a href="https://www.instagram.com/nutri_fodmap_marleneruivo" style="display: inline-block; margin-right: 10px; text-decoration: none;">
                      <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" style="width: 24px; height: 24px;">
                    </a>
                    <a href="https://www.linkedin.com/in/marlene-ruivo-b2a2104a/" style="display: inline-block; text-decoration: none;">
                      <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" style="width: 24px; height: 24px;">
                    </a>
                  </div>
                </div>
                
                <div style="text-align: center; margin-top: 40px;">
                  <p style="font-size: 10px; color: #ccc; text-transform: uppercase; letter-spacing: 2px;">© 2026 Dra. Marlene Ruivo • Nutrição Funcional</p>
                </div>
              </div>
            `
          })
        });
        
        if (!brevoResponse.ok) {
          const brevoError = await brevoResponse.json();
          console.error('Erro na API da Brevo:', brevoError);
        }
      } catch (emailErr) {
        console.error('Erro ao processar envio de email:', emailErr);
      }
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Erro crítico na API MB WAY:', error);
    return res.status(500).json({ 
      error: 'Erro interno no servidor de pagamentos.',
      details: error.message 
    });
  }
}
