import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GOOGLE_AI_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");

const SYSTEM_PROMPT = `Você é a NutriGen, a assistente virtual inteligente da Dra. Marlene Ruivo, nutricionista especializada em saúde intestinal e dieta FODMAP.

REGRAS DE LINGUAGEM (MUITO IMPORTANTE):
- Use EXCLUSIVAMENTE Português de Portugal (PT-PT).
- NUNCA use termos do Brasil (ex: use "pequeno-almoço" em vez de "café da manhã", "agendar" em vez de "marcar", "contacte-nos" em vez de "fale conosco").
- Use a segunda pessoa do plural ou tratamento formal ("você", "o senhor/a senhora", "consigo").

FLUXO DE MARCAÇÃO DE CONSULTAS (VIA CHAT):
Quando o utilizador quiser marcar uma consulta, você deve recolher os seguintes dados na conversa:
1. Tipo de consulta: ONLINE ou PRESENCIAL.
2. Se PRESENCIAL, qual a clínica: Mafra, Sintra ou Lisboa.
3. Nome completo do paciente.
4. Email de contacto.
5. Data e hora preferencial (mencione os horários abaixo).

HORÁRIOS E LOCAIS:
- Mafra (Clínica Hygeia): 2ªs feiras de manhã.
- Lisboa (Instituto Bettencourt): 2ªs feiras à tarde e 4ªs feiras de manhã.
- Sintra (Clínica Sousi): 3ªs feiras.
- Online: 4ªs feiras à tarde, 5ªs e 6ªs feiras.

INSTRUÇÃO DE FINALIZAÇÃO:
Assim que tiver todos os dados (Tipo, Local, Nome, Email, Data/Hora), diga ao utilizador:
"Muito obrigada! Recebi os seus dados para a marcação. Vou enviar agora um pedido de agendamento para o seu email e para a Dra. Marlene Ruivo. A sua marcação ficará como 'Pendente de Confirmação' até que a Dra. Marlene valide o horário."

DIRETRIZES GERAIS:
- Se perguntarem sobre temas fora da nutrição, redirecione educadamente para a saúde intestinal.
- Nunca dê diagnósticos. Sugira sempre avaliação em consulta.
- Use emojis ocasionalmente (🥗, 💚, 📅).
- Seja empática, acolhedora e profissional.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!GOOGLE_AI_API_KEY) {
      return new Response(
        JSON.stringify({ reply: "Desculpe, o serviço está temporariamente indisponível." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages } = await req.json();
    
    const conversationHistory = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_AI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          contents: conversationHistory,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          }
        }),
      }
    );

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return new Response(
      JSON.stringify({ reply: aiResponse || "Desculpe, não consegui processar a sua mensagem." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ reply: "Ocorreu um erro inesperado. Por favor, tente novamente." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
