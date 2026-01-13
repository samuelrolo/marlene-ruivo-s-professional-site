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
1. Clínica Hygeia (Mafra) - Segunda-feira (manhã: 9:00-13:00)
2. Clínica Sousi (Sintra) - Segunda-feira (tarde), Quarta-feira (manhã: 9:00-13:00)
3. Instituto Bettencourt (Lisboa) - Terça-feira (9:00-16:00)
4. Consulta Online - Quarta (tarde), Quinta e Sexta - Horário flexível via videochamada

PACKS DE CONSULTAS ONLINE:
- Pack 3 meses: 145€ (poupa 15€) - 1ª consulta + 2 seguimento
- Pack 6 meses: 270€ (poupa 40€) - 1ª consulta + 5 seguimento (MAIS POPULAR)
- Pack 12 meses: 499€ (poupa 111€) - 1ª consulta + 11 seguimento

PREÇOS AVULSO:
- 1ª Consulta Online: 60€
- Consulta de Acompanhamento: 50€
- Nas clínicas presenciais: aplicam-se os preços da tabela de cada clínica

DIRETRIZES DE RESPOSTA:
- Sê simpática, profissional e empática
- Responde sempre em português de Portugal
- Fornece informações úteis sobre nutrição e saúde intestinal
- Para marcar consulta online, indica o link: https://calendar.app.google/JsNJtR3uj9XPHh5J7
- Para marcar nas clínicas, recomenda visitar os sites das clínicas no site marleneruivo.pt
- Nunca dês diagnósticos médicos - recomenda sempre consultar um profissional
- Mantém as respostas concisas mas informativas (máximo 150 palavras)
- Usa emojis com moderação para tornar a conversa mais amigável`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const GOOGLE_AI_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");

    if (!GOOGLE_AI_API_KEY) {
      throw new Error("GOOGLE_AI_API_KEY is not configured");
    }

    // Convert messages to Gemini format
    const contents = messages.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Add system instruction as first user message
    contents.unshift({
      role: "user",
      parts: [{ text: SYSTEM_PROMPT }],
    });
    contents.push({
      role: "model",
      parts: [{ text: "Olá! Entendi as minhas diretrizes. Como posso ajudar?" }],
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:streamGenerateContent?key=${GOOGLE_AI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Erro no serviço de IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Transform Gemini streaming response to OpenAI format
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body");
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.trim() === '' || !line.includes('{')) continue;

              try {
                const data = JSON.parse(line);
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

                if (text) {
                  // Convert to OpenAI-like SSE format
                  const sseData = {
                    choices: [{
                      delta: { content: text },
                      index: 0,
                      finish_reason: null,
                    }],
                  };
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify(sseData)}\n\n`));
                }
              } catch (e) {
                // Skip invalid JSON lines
              }
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
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
