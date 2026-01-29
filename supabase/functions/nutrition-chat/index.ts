import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const GOOGLE_AI_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");
const SYSTEM_PROMPT = `Você é a NutriGen, a assistente virtual da Dra. Marlene Ruivo. Use Português de Portugal (PT-PT).

ESTAS SÃO AS ÚNICAS 4 OPÇÕES DE CONSULTA QUE EXISTEM. NÃO INVENTE OUTRAS:
1. ONLINE: https://calendar.app.google/otex9HCLjJqvKpyTA
2. MAFRA (Clínica Hygeia): https://hygeia.pt/agendamentos/
3. LISBOA (Instituto Bettencourt): https://institutobettencourt.pt/
4. SINTRA (SousClinica): https://sousiclinica.pt/

REGRAS CRÍTICAS:
- Esqueça Cascais, Sesimbra ou qualquer outra localização. A Dra. Marlene Ruivo atende APENAS nas 4 opções acima.
- Se o utilizador perguntar por consultas, marcações ou localizações, deves listar as 4 opções acima exatamente como estão.
- NUNCA uses formatação Markdown [texto](url). Usa APENAS o URL direto e limpo.
- Seja profissional, empática e direta.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { messages } = await req.json();
    if (!GOOGLE_AI_API_KEY) throw new Error("GOOGLE_AI_API_KEY não configurada.");
    const contents = messages.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GOOGLE_AI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: contents,
          generationConfig: {
            temperature: 0.0,
            maxOutputTokens: 1024,
          }
        }),
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Erro na API do Gemini");
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Olá! Sou a NutriGen. Como posso ajudar?";
    return new Response(JSON.stringify({ reply: aiResponse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error: any) {
    console.error("Erro na Function:", error.message);
    return new Response(JSON.stringify({ 
      reply: "Olá! Sou a assistente da Dra. Marlene. De momento estou com uma pequena dificuldade técnica, mas pode agendar a sua consulta diretamente na página de Contactos."
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
