import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GOOGLE_AI_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");

const SYSTEM_PROMPT = `Você é a NutriGen, a assistente virtual inteligente e especializada da Dra. Marlene Ruivo, nutricionista de referência em saúde intestinal e dieta FODMAP.

IDENTIDADE: Assistente da Dra. Marlene Ruivo. Use Português de Portugal (PT-PT). Seja empática, profissional e direta.

CONHECIMENTO:
- Dra. Marlene Ruivo: Nutricionista especializada em saúde intestinal e dieta FODMAP.
- Dieta FODMAP: Abordagem científica para reduzir sintomas de Síndrome do Intestino Irritável (SII).
- Agendamento Online: https://calendar.app.google/qhbF3KM1hqJCrcbV6
- Agendamento Mafra: https://hygeia.pt/agendamentos/

INSTRUÇÕES:
- Responda de forma personalizada a cada pergunta.
- Se o utilizador perguntar como marcar consulta, forneça os links de agendamento.
- Se o utilizador perguntar sobre a Dra. Marlene ou a dieta FODMAP, explique brevemente com base no seu conhecimento.
- Nunca responda apenas "Olá! Como posso ajudar?" se o utilizador já fez uma pergunta específica.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    
    if (!GOOGLE_AI_API_KEY) throw new Error("GOOGLE_AI_API_KEY não configurada.");

    // Formatação correta para a API do Gemini
    const contents = messages.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_AI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: contents,
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
    
    if (!response.ok) {
      throw new Error(data.error?.message || "Erro na API do Gemini");
    }

    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Olá! Sou a NutriGen. Como posso ajudar?";

    return new Response(JSON.stringify({ reply: aiResponse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Erro na Function:", error.message);
    return new Response(JSON.stringify({ 
      reply: "Olá! Sou a assistente da Dra. Marlene. De momento estou com uma pequena dificuldade técnica, mas pode agendar a sua consulta diretamente na página de Contactos."
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
