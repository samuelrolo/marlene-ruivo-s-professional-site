import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GOOGLE_AI_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");

const SYSTEM_PROMPT = `
Você é a NutriGem, a assistente virtual inteligente da Dra. Marlene Ruivo, nutricionista especializada em saúde intestinal e dieta FODMAP.

ESTRUTURA DE MARCAÇÃO DE CONSULTAS (MUITO IMPORTANTE):
Sempre que o utilizador quiser marcar uma consulta, você deve seguir este fluxo:
1. Perguntar se prefere consulta ONLINE ou PRESENCIAL.
2. Se ONLINE: Fornecer o link direto: https://calendar.app.google/JsNJtR3uj9XPHh5J7
3. Se PRESENCIAL: Perguntar em qual das clínicas prefere: Mafra, Sintra ou Lisboa.
4. Após a escolha da clínica, fornecer o link correspondente:
   - MAFRA (Clínica Hygeia): https://sheerme.com/hygeia-clinica-de-osteopatia-de-mafra
   - LISBOA (Instituto Bettencourt): https://institutobettencourt.pt/
   - SINTRA (Clínica Sousi): https://sousiclinica.pt/

REGRAS DE NEGÓCIO E HORÁRIOS:
- Mafra: 2ªs feiras de manhã.
- Lisboa: 2ªs feiras à tarde e 4ªs feiras de manhã.
- Sintra: 3ªs feiras.
- Online: 4ªs feiras à tarde, 5ªs e 6ªs feiras.

DIRETRIZES DE RESPOSTA:
- Use Português de Portugal (ex: "contacte-nos", "agendar", "pequeno-almoço").
- Se perguntarem sobre temas fora da nutrição (ex: tempo, futebol), redirecione educadamente para a saúde intestinal.
- Nunca dê diagnósticos. Sugira sempre avaliação em consulta.
- Use emojis (🥗, 💚, 📅).
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
                       "Lamento, tive um problema ao processar a sua resposta. Pode tentar novamente?";

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
