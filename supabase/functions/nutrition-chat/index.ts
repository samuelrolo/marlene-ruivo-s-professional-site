import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Knowledge base with smart pattern matching
const responses = {
  fodmap: `FODMAP é um acrónimo para Fermentáveis, Oligossacarídeos, Dissacarídeos, Monossacarídeos And Polióis. 🥗

São hidratos de carbono de difícil digestão que podem causar desconforto intestinal em pessoas sensíveis. A estratégia FODMAP tem 3 fases:

1️⃣ **Redução** - Eliminar FODMAPs temporariamente
2️⃣ **Reintrodução** - Testar alimentos gradualmente  
3️⃣ **Personalização** - Criar dieta adaptada

A Dra. Marlene é certificada Monash em FODMAP! 😊`,

  consulta: `Para marcar consulta comigo:

📍 **Presencial:**
- Clínica Hygeia (Mafra) - 2ªs manhã
- Instituto Bettencourt (Sintra) - 3ªs
- Clínica Sousi (Lisboa) - 2ªs tarde e 4ªs manhã

💻 **Online:** 4ªs tarde, 5ªs e 6ªs
Agendar aqui: https://calendar.app.google/JsNJtR3uj9XPHh5J7

Tem dúvidas sobre locais ou horários? 😊`,

  packs: `Temos packs especiais para consultas online! 💚

📦 **Pack 3 Meses** - 145€ (poupa 15€)
• 1ª consulta + 2 seguimentos

📦 **Pack 6 Meses** - 270€ (poupa 40€) ⭐ MAIS POPULAR
• 1ª consulta + 5 seguimentos

📦 **Pack 12 Meses** - 499€ (poupa 111€)
• 1ª consulta + 11 seguimentos

Quer agendar? https://calendar.app.google/JsNJtR3uj9XPHh5J7`,

  sintomas: `Sintomas intestinais como inchaço, dor abdominal, gases, diarreia ou obstipação podem estar relacionados com a alimentação. 🌿

A estratégia FODMAP pode ajudar a identificar os alimentos gatilho. Mas é importante:

✅ Ter acompanhamento profissional
✅ Não fazer eliminações sem orientação
✅ Investigar outras causas com médico

Gostaria de marcar uma consulta para avaliarmos? 😊`,

  sii: `A Síndrome do Intestino Irritável (SII) é uma condição funcional que afeta o sistema digestivo. 

A estratégia FODMAP é cientificamente comprovada para ajudar em 75% dos casos de SII! 

Trabalho de forma personalizada para:
✅ Identificar gatilhos alimentares
✅ Aliviar sintomas
✅ Recuperar qualidade de vida

Quer saber mais sobre como posso ajudar? 💚`,

  default: `Olá! 👋 Sou a NutriGem, assistente da Dra. Marlene Ruivo.

Posso ajudar com:
🥗 Informações sobre FODMAP
📅 Marcação de consultas
💊 Sintomas intestinais
📦 Packs de consultas

Como posso ajudar hoje? 😊`
};

function getResponse(message: string): string {
  const msg = message.toLowerCase();

  if (msg.includes('fodmap') || msg.includes('ferment')) return responses.fodmap;
  if (msg.includes('consult') || msg.includes('marcar') || msg.includes('agendar') || msg.includes('local')) return responses.consulta;
  if (msg.includes('pack') || msg.includes('preço') || msg.includes('valor') || msg.includes('custo')) return responses.packs;
  if (msg.includes('sintoma') || msg.includes('dor') || msg.includes('inchaço') || msg.includes('gases')) return responses.sintomas;
  if (msg.includes('sii') || msg.includes('intestino irritável') || msg.includes('sibo')) return responses.sii;

  return responses.default;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const messages = body?.messages;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages array is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userMessage = messages[messages.length - 1].content;
    const responseText = getResponse(userMessage);

    // Return in OpenAI-like format
    return new Response(JSON.stringify({
      id: "chatcmpl-" + Date.now(),
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model: "nutrigem-smart-responses",
      choices: [{
        index: 0,
        message: {
          role: "assistant",
          content: responseText
        },
        finish_reason: "stop"
      }]
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: "Desculpe, ocorreu um erro. Tente contactar-nos através do formulário: https://marleneruivo.pt/contactos" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
