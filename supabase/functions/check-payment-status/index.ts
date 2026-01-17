import "https://deno.land/x/xhr@0.3.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const url = new URL(req.url);
        const requestId = url.searchParams.get('requestId');

        if (!requestId) {
            throw new Error('Missing requestId parameter');
        }

        const ifthenpayKey = Deno.env.get('IFTHENPAY_MBWAY_KEY');

        if (!ifthenpayKey) {
            throw new Error('IfthenPay credentials not configured');
        }

        // Check payment status with IfthenPay
        const statusResponse = await fetch(`https://ifthenpay.com/api/spg/payment/mbway/status?mbWayKey=${ifthenpayKey}&requestId=${requestId}`);
        const statusData = await statusResponse.json();

        return new Response(
            JSON.stringify({
                status: statusData.Status === '000' ? 'confirmed' : statusData.Status === 'pending' ? 'pending' : 'failed',
                requestId: requestId,
                message: statusData.Message
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        );

    } catch (error) {
        console.error('Status check error:', error);
        return new Response(
            JSON.stringify({
                status: 'error',
                error: error.message
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400
            }
        );
    }
});
