const axios = require('axios');

/**
 * MB WAY Payment API
 * Processes payments through Ifthenpay MB WAY service
 */

// Rate limiting store (in-memory, resets on serverless function cold starts)
const rateLimitStore = new Map();

// Rate limiting: max 5 requests per IP per hour
function checkRateLimit(ip) {
    const now = Date.now();
    const requests = rateLimitStore.get(ip) || [];

    // Filter requests from last hour
    const recentRequests = requests.filter(time => now - time < 3600000);

    if (recentRequests.length >= 5) {
        return false; // Rate limit exceeded
    }

    recentRequests.push(now);
    rateLimitStore.set(ip, recentRequests);
    return true;
}

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed',
            message: 'Only POST requests are accepted'
        });
    }

    // Rate limiting
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (!checkRateLimit(clientIp)) {
        return res.status(429).json({
            error: 'Too many requests',
            message: 'Limite de pedidos excedido. Tente novamente mais tarde.'
        });
    }

    const { phoneNumber, amount, email } = req.body;

    // Get MB WAY key from environment variables (SECURE)
    const mbWayKey = process.env.MBWAY_KEY;

    if (!mbWayKey) {
        console.error('MBWAY_KEY not configured in environment variables');
        return res.status(500).json({
            error: 'Server configuration error',
            message: 'Configuração em falta: MBWAY_KEY não encontrada no servidor.'
        });
    }

    // Validate required fields
    if (!phoneNumber || !amount) {
        return res.status(400).json({
            error: 'Missing required fields',
            message: 'Dados em falta: Telemóvel e Valor são obrigatórios.'
        });
    }

    // Validate phone number format (Portuguese mobile)
    const phoneRegex = /^(9[1236]\d{7}|9[1236]\d{7})$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
        return res.status(400).json({
            error: 'Invalid phone number',
            message: 'Número de telemóvel inválido. Use formato: 9XXXXXXXX'
        });
    }

    // Validate amount (must be positive number)
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
        return res.status(400).json({
            error: 'Invalid amount',
            message: 'Valor inválido. Deve ser um número positivo.'
        });
    }

    try {
        // Ifthenpay MB WAY API Endpoint
        const url = 'https://mbway.ifthenpay.com/ifthenpaymbw.asmx/SetPedidoJSON';

        // Generate a unique reference ID
        const orderId = 'MR' + Date.now();

        const params = new URLSearchParams();
        params.append('MbWayKey', mbWayKey);
        params.append('canal', '03');
        params.append('referencia', orderId);
        params.append('valor', numAmount.toFixed(2));
        params.append('nrtlm', phoneNumber.replace(/\s/g, ''));
        params.append('email', email || '');
        params.append('descricao', 'Consulta Nutricao - Marlene Ruivo');

        console.log('[MB WAY] Processing payment:', { orderId, amount: numAmount, phone: phoneNumber.substring(0, 3) + '******' });

        // Call Ifthenpay API
        const response = await axios.post(url, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            timeout: 10000 // 10 second timeout
        });

        const data = response.data;

        console.log('[MB WAY] API Response:', data);

        // Return response to client
        return res.status(200).json({
            success: true,
            orderId,
            data
        });

    } catch (error) {
        console.error('[MB WAY] API Error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });

        // Extract meaningful error message
        let errorDetail = error.message;
        if (error.response && error.response.data) {
            try {
                errorDetail = typeof error.response.data === 'string'
                    ? error.response.data
                    : JSON.stringify(error.response.data);
            } catch (e) {
                errorDetail = "Erro desconhecido no servidor de pagamentos";
            }
        }

        return res.status(500).json({
            error: 'Payment processing failed',
            message: `Erro de comunicação com MB WAY: ${errorDetail}`,
            details: error.response?.status ? `HTTP ${error.response.status}` : 'Network error'
        });
    }
};
