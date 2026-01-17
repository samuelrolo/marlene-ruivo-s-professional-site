import "https://deno.land/x/xhr@0.3.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
    name: string;
    email: string;
    phone: string;
    consultationType: 'first' | 'followup' | 'online';
}

const getAmount = (type: string): string => {
    const amounts = {
        'first': '60.00',
        'followup': '40.00',
        'online': '55.00'
    };
    return amounts[type] || '60.00';
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { name, email, phone, consultationType }: PaymentRequest = await req.json();

        // Validations
        if (!name || !email || !phone || !consultationType) {
            throw new Error('Missing required fields');
        }

        // Validate phone number (9 digits starting with 9)
        const phoneRegex = /^9[0-9]{8}$/;
        if (!phoneRegex.test(phone)) {
            throw new Error('Invalid phone number. Must be 9 digits starting with 9');
        }

        const amount = getAmount(consultationType);
        const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // IfthenPay MB WAY API Call
        const ifthenpayKey = Deno.env.get('IFTHENPAY_MBWAY_KEY');
        const ifthenpayEntity = Deno.env.get('IFTHENPAY_ENTITY');

        if (!ifthenpayKey) {
            throw new Error('IfthenPay credentials not configured');
        }

        // IfthenPay MB WAY Request
        const ifthenpayResponse = await fetch('https://ifthenpay.com/api/spg/payment/mbway', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mbWayKey: ifthenpayKey,
                orderId: orderId,
                amount: amount,
                mobileNumber: `351${phone}`,
                email: email,
                description: `Consulta Nutrição - ${name}`
            })
        });

        const ifthenpayData = await ifthenpayResponse.json();

        if (ifthenpayData.Status !== '000') {
            throw new Error(ifthenpayData.Message || 'Payment request failed');
        }

        // Store payment in Supabase for tracking
        // You could add database storage here if needed

        return new Response(
            JSON.stringify({
                success: true,
                requestId: ifthenpayData.RequestId,
                orderId: orderId,
                amount: amount,
                message: 'Payment request sent to your phone'
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        );

    } catch (error) {
        console.error('Payment error:', error);
        return new Response(
            JSON.stringify({
                success: false,
                error: error.message || 'Payment processing failed'
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400
            }
        );
    }
});
