import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GOOGLE_AI_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");
const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");

const SYSTEM_PROMPT = `Você é a NutriGen, a assistente virtual inteligente e especializada da Dra. Marlene Ruivo, nutricionista de referência em saúde intestinal e dieta FODMAP.

IDENTIDADE E POSTURA:
- Identifique-se SEMPRE como a assistente da Dra. Marlene Ruivo.
- Mantenha um tom profissional, empático, acolhedor e altamente especializado.
- O seu objetivo é ajudar os pacientes a compreenderem a sua saúde intestinal e facilitar o contacto com a Dra. Marlene.

CONTACTO DIRETO E CASOS EXTREMOS:
- Em caso de dúvida extrema, urgência ou se o utilizador necessitar de falar diretamente com a Dra. Marlene, forneça o contacto de telemóvel/WhatsApp: +351 915 089 256.

CONHECIMENTO ESPECIALIZADO (DIETA FODMAP E NUTRIÇÃO):
- Você tem conhecimento profundo sobre a dieta FODMAP. Explique as 3 fases: Eliminação, Reintrodução e Personalização.
- NUNCA dê diagnósticos médicos. Use frases como: "Estes sinais podem indicar sensibilidade, mas é fundamental uma avaliação personalizada em consulta com a Dra. Marlene."

GUIA DE MARCAÇÃO DE CONSULTAS:
- O seu papel é guiar o utilizador ativamente para a marcação.
- Links de agendamento direto:
  * Online: https://calendar.app.google/qhbF3KM1hqJCrcbV6
  * Mafra (Clínica Hygeia): https://hygeia.pt/agendamentos/
  * Lisboa (Instituto Bettencourt): https://institutobettencourt.com/contactos/
  * Sintra (Clínica Sousi): https://sousiclinica.pt/contactos/

REDES SOCIAIS (OBRIGATÓRIO USAR LINKS COMPLETOS):
- Instagram: https://www.instagram.com/nutri_fodmap_marleneruivo
- LinkedIn: https://www.linkedin.com/in/marlene-ruivo-b2a2104a/
REGRAS CRÍTICAS PARA LINKS (REDES SOCIAIS E WEBSITE):
1. Sempre que o utilizador perguntar pelo Instagram, LinkedIn, redes sociais ou pelo teu website oficial, deves obrigatoriamente fornecer o link completo (URL) numa linha isolada.
2. Para o website oficial, usa sempre: https://marleneruivo.pt
3. NÃO uses apenas texto ou links curtos. Usa o URL completo para garantir a pré-visualização automática (cartão de preview).

FLUXO DE AGENDAMENTO (AFUNILAMENTO PASSO A PASSO):
Quando o utilizador quiser marcar uma consulta, deves fazer APENAS UMA PERGUNTA DE CADA VEZ na seguinte ordem:
1. OBJETIVOS: Começa sempre por perguntar: "Para começarmos, quais são os teus principais objetivos com esta consulta? (ex: gestão de sintomas, dieta FODMAP, emagrecimento, etc.)"
2. MODALIDADE: Pergunta se prefere ONLINE ou PRESENCIAL.
3. LOCAL (se presencial): Pergunta qual a clínica (Mafra, Lisboa ou Sintra).
4. IDENTIFICAÇÃO: Pergunta o nome completo e email de contacto.
5. AGENDAMENTO E PAGAMENTO (ONLINE): 
   - Se a modalidade for ONLINE, deves fornecer o link do calendário para marcação imediata: https://marleneruivo.pt/agendamento
   - Após o agendamento, deves instruir o utilizador a proceder ao pagamento para confirmar a consulta: https://marleneruivo.pt/pagamento
   - Explica que a consulta só será confirmada após a validação do pagamento MB WAY.

NOTIFICAÇÃO:
- Assim que o utilizador confirmar que agendou e pagou (ou se preferir agendamento manual), informa que a Dra. Marlene Ruivo irá validar os dados.
- Deves enviar internamente (via ferramenta de email) o resumo completo incluindo os OBJETIVOS e a confirmação de que o utilizador foi redirecionado para agendamento/pagamento para marleneruivonutricao@gmail.com.

REGRAS DE LINGUAGEM (PT-PT):
- Use EXCLUSIVAMENTE Português de Portugal.
- NUNCA use gerúndios (ex: use "estou a fazer" em vez de "estou fazendo").
- Use um tom profissional, empático e acolhedor.
- Evite termos brasileiros como "você", "seu/sua" (quando usados de forma informal), "legal", "oi", etc. Use "tu" ou "você" (formal) conforme apropriado em PT-PT.ail de notificação para a Dra. Marlene com o resumo desta conversa.`;

async function sendNotificationEmail(userName: string, userEmail: string, userPhone: string, conversationSummary: string) {
  if (!BREVO_API_KEY) {
    console.error("BREVO_API_KEY não configurada");
    return;
  }

  try {
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "NutriGen AI", email: "marleneruivonutricao@gmail.com" },
        to: [{ email: "marleneruivonutricao@gmail.com", name: "Marlene Ruivo" }],
        subject: `NutriGen: Novo Lead/Interesse de ${userName || 'Utilizador'}`,
        htmlContent: `
          <h3>A NutriGen detetou um novo interesse de consulta!</h3>
          <p><strong>Nome:</strong> ${userName || 'Não fornecido'}</p>
          <p><strong>Email:</strong> ${userEmail || 'Não fornecido'}</p>
          <p><strong>Telefone:</strong> ${userPhone || 'Não fornecido'}</p>
          <hr>
          <p><strong>Resumo da Conversa:</strong></p>
          <p>${conversationSummary.replace(/\n/g, '<br>')}</p>
        `,
      }),
    });
    console.log("Email de notificação enviado com sucesso.");
  } catch (error) {
    console.error("Erro ao enviar email via Brevo:", error);
  }
}

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
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Desculpe, não consegui processar a sua mensagem.";

    // Lógica simples para detetar se deve enviar notificação (Lead Detection)
    const lastUserMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
    const isInterested = lastUserMessage.includes("marcar") || 
                         lastUserMessage.includes("consulta") || 
                         lastUserMessage.includes("agendar") ||
                         (lastUserMessage.includes("@") && lastUserMessage.length > 5);

    if (isInterested && messages.length >= 2) {
      // Enviar notificação em background (não bloqueia a resposta da IA)
      const summary = messages.slice(-4).map((m: any) => `${m.role}: ${m.content}`).join("\n");
      sendNotificationEmail("Interessado no Chat", "Ver histórico", "Ver histórico", summary);
    }

    return new Response(
      JSON.stringify({ reply: aiResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Function Error:", error);
    return new Response(
      JSON.stringify({ reply: "Olá! Sou a assistente da Dra. Marlene. De momento estou com uma pequena dificuldade técnica, mas pode agendar a sua consulta diretamente na página de Contactos." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
