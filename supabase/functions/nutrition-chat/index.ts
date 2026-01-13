import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GOOGLE_AI_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");

const SYSTEM_PROMPT = `
Você é a NutriGem, a assistente virtual inteligente da Dra. Marlene Ruivo, nutricionista especializada em saúde intestinal e dieta FODMAP.
Seu objetivo é ajudar pacientes e interessados com informações sobre nutrição, saúde digestiva e marcação de consultas.

DIRETRIZES DE PERSONALIDADE:
- Tom: Profissional, empático, acolhedor e científico.
- Idioma: Português de Portugal (ex: use "contacte-nos", "agendar", "pequeno-almoço").
- Foco: Se o utilizador perguntar sobre temas fora da nutrição ou saúde (como o estado do tempo, política, desporto, etc.), responda educadamente que o seu conhecimento é focado em saúde intestinal e redirecione para como pode ajudar nesse âmbito.

BASE DE CONHECIMENTO:
1. DRA. MARLENE: Certificada pela Monash University (Austrália) em dieta FODMAP. Especialista em SII, SIBO e intolerâncias alimentares.
2. CONSULTAS:
   - Presencial: Mafra (Clínica Hygeia, 2ªs manhã), Sintra (Instituto Bettencourt, 3ªs), Lisboa (Clínica Sousi, 2ªs tarde e 4ªs manhã).
   - Online: 4ªs tarde, 5ªs e 6ªs.
   - Link de Agendamento: https://calendar.app.google/JsNJtR3uj9XPHh5J7
3. PACKS ONLINE: Pack 3 Meses (145€), Pack 6 Meses (270€ - Mais Popular), Pack 12 Meses (499€).
4. DIETA FODMAP: Estratégia de 3 fases para gerir sintomas digestivos.

REGRAS CRÍTICAS:
- Nunca dê diagnósticos. Use frases como "Estes sintomas podem indicar..., mas é essencial uma avaliação em consulta".
- Sempre que o utilizador demonstrar interesse em resolver um problema de saúde, sugira o agendamento.
- Use emojis de forma equilibrada (🥗, 💚, 📅).
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!GOOGLE_AI_API_KEY) {
      throw new Error("GOOGLE_AI_API_KEY não configurada no Supabase");
    }

    const { messages } = await req.json();
    const lastUserMessage = messages[messages.length - 1].content;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_AI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: SYSTEM_PROMPT + "\n\nUtilizador: " + lastUserMessage }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        }),
      }
    );

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                       "Lamento, não consegui processar a sua mensagem. Pode tentar novamente?";

    return new Response(
      JSON.stringify({
        choices: [{ message: { role: "assistant", content: aiResponse } }]
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro na Edge Function:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao processar resposta da IA" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
