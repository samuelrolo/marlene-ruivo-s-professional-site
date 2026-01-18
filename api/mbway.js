
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phoneNumber, amount, email } = req.body;
  
  // Prioridade para variáveis de ambiente da Vercel
  const mbWayKey = process.env.MBWAYKEY || 'BCS-378163';
  const BREVO_API_KEY = process.env.BREVO_API_KEY;

  console.log('Iniciando pedido MB WAY para:', phoneNumber, 'Valor:', amount);

  if (!phoneNumber || !amount) {
    return res.status(400).json({ error: 'Dados em falta: Telemóvel e Valor são obrigatórios.' });
  }

  try {
    // 1. Pedido à IFThenPay
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

    // 2. Se o pedido foi aceite, tentar enviar email de confirmação
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
              <div style="font-family: sans-serif; color: #2C4A3E; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 20px;">
                <h2 style="color: #6FA89E; text-align: center;">Confirmação de Pedido</h2>
                <p>Olá,</p>
                <p>Este email confirma a receção do pedido de agendamento para a consulta de nutrição.</p>
                <div style="background-color: #FDFCFB; padding: 15px; border-radius: 15px; margin: 20px 0;">
                  <p style="margin: 5px 0;"><strong>Valor:</strong> ${amount}€</p>
                  <p style="margin: 5px 0;"><strong>Método:</strong> MB WAY (${phoneNumber})</p>
                  <p style="margin: 5px 0;"><strong>Referência:</strong> ${orderId}</p>
                </div>
                <p>Para concluir o processo, basta validar a notificação na aplicação MB WAY no telemóvel. Após a confirmação do pagamento, a vaga no calendário fica garantida de forma automática.</p>
                <p>Caso surja alguma dúvida ou dificuldade, basta responder a este email ou contactar através do número 915 089 256.</p>
                <p style="margin-top: 30px;">Com os melhores cumprimentos,</p>
                <p><strong>Dra. Marlene Ruivo</strong><br><small>Nutricionista</small></p>
              </div>
            `
          })
        });
        
        if (!brevoResponse.ok) {
          const brevoError = await brevoResponse.json();
          console.error('Erro na API da Brevo:', brevoError);
        } else {
          console.log('Email enviado com sucesso.');
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
