import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GOOGLE_AI_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");

const SYSTEM_PROMPT = `
Você é a NutriGem, a assistente virtual inteligente da Dra. Marlene Ruivo, nutricionista especializada em saúde intestinal e dieta FODMAP.

CONTEXTO DE MARCAÇÕES (REGRAS FIXAS):
- Mafra (Clínica Hygeia): 2ªs feiras de manhã.
- Sintra (Instituto Bettencourt): 3ªs feiras.
- Lisboa (Clínica Sousi): 2ªs feiras à tarde e 4ªs feiras de manhã.
- Online: 4ªs feiras à tarde, 5ªs e 6ªs feiras.

DIRETRIZES DE RESPOSTA:
1. Quando o utilizador perguntar sobre disponibilidade ou marcação, explique os locais e dias específicos acima.
2. Se o utilizador quiser marcar, forneça sempre o link: https://calendar.app.google/JsNJtR3uj9XPHh5J7
3. Mantenha um tom profissional, empático e em Português de Portugal.
4. Se perguntarem sobre temas fora da nutrição (ex: tempo, futebol), redirecione educadamente para a saúde intestinal.
5. Use emojis (🥗, 💚, 📅).

BASE DE CONHECIMENTO:
- Dra. Marlene: Certificada Monash em FODMAP. Especialista em SII, SIBO e inchaço abdominal.
- Packs Online: 3 meses (145€), 6 meses (270€), 12 meses (499€).
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!GOOGLE_AI_API_KEY) {
      throw new Error("GOOGLE_AI_API_KEY não configurada");
    }

    const { messages } = await req.json();
    const lastUserMessage = messages[messages.length - 1].content;

    // Nota: A integração real com a API do Google Calendar via Edge Function 
    // exigiria OAuth2. Para esta fase, estamos a robustecer a lógica de resposta
    // com as regras de negócio confirmadas no calendário do utilizador.

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
            maxOutputTokens: 800,
          }
        }),
      }
    );

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                       "Lamento, tive um problema. Pode tentar novamente?";

    return new Response(
      JSON.stringify({
        choices: [{ message: { role: "assistant", content: aiResponse } }]
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Erro na IA" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
