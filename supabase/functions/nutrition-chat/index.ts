import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Tu és a assistente virtual da Dra. Marlene Ruivo, nutricionista especializada em saúde intestinal, FODMAP e SII/SIBO. 

SOBRE A DRA. MARLENE RUIVO:
- Nutricionista certificada pela Universidade Monash (Austrália) em dieta Low-FODMAP
- Especialista em Síndrome do Intestino Irritável (SII), SIBO e eixo intestino-cérebro
- Atende em 3 clínicas físicas e online

LOCAIS DE CONSULTA:
1. Clínica Hygeia (Mafra) - Segunda-feira, 9:00-13:00
2. Instituto Bettencourt (Lisboa) - Terça-feira, 9:00-16:00
3. Clínica Sousi (Sintra) - Quarta-feira, 9:00-17:00
4. Consulta Online - Horário flexível via videochamada

PREÇOS:
- 1ª Consulta: 60€
- Consulta de Acompanhamento: 50€

SERVIÇOS PRINCIPAIS:
- Tratamento de SII (Síndrome do Intestino Irritável)
- Tratamento de SIBO (Supercrescimento Bacteriano)
- Dieta Low-FODMAP personalizada
- Abordagem do eixo intestino-cérebro
- Acompanhamento nutricional para saúde digestiva

DIRETRIZES DE RESPOSTA:
- Sê simpática, profissional e empática
- Responde sempre em português de Portugal
- Fornece informações úteis sobre nutrição e saúde intestinal
- Para marcar consulta, indica o email: marleneruivo.nutricao@gmail.com ou sugere usar o formulário de contacto
- Nunca dês diagnósticos médicos - recomenda sempre consultar um profissional
- Mantém as respostas concisas mas informativas (máximo 150 palavras)
- Usa emojis com moderação para tornar a conversa mais amigável`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Muitos pedidos. Por favor, aguarde um momento." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Serviço temporariamente indisponível." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Erro no serviço de IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
