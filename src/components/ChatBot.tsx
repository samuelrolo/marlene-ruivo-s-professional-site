import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

type Message = { role: "user" | "assistant"; content: string };

// Fallback values to ensure it works even if env vars fail during build
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://gkuihdqlhxmljpezoufo.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrdWloZHFsaHhtbGpwZXpvdWZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwODk0NzAsImV4cCI6MjA4MTY2NTQ3MH0.SIhytc97DI71Am_ISaqNqd53sYLuZLVXpiR8jXon4Yw';
const CHAT_URL = `${SUPABASE_URL}/functions/v1/nutrition-chat`;

const QUICK_PROMPTS = [
  { label: "O que é FODMAP?", message: "O que é FODMAP?" },
  { label: "Tenho sintomas", message: "Tenho sintomas intestinais, como inchaço e desconforto. O que posso fazer?" },
  { label: "Marcar consulta", message: "Gostaria de marcar uma consulta com a Dra. Marlene Ruivo." },
];

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setShowPrompts(false);
    setIsLoading(true);

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.error || "Erro ao conectar com o assistente");
      }

      const data = await resp.json();
      const assistantContent = data.choices?.[0]?.message?.content || data.reply || "Desculpe, não consegui processar a sua mensagem.";
      
      setMessages(prev => [...prev, { role: "assistant", content: assistantContent }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Desculpe, ocorreu um erro. Por favor, tente novamente ou contacte-nos diretamente através do formulário."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickPrompt = (message: string) => {
    handleSend(message);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full",
          "bg-white shadow-lg hover:shadow-xl",
          "transition-all duration-300 hover:scale-105",
          "flex items-center justify-center p-2",
          isOpen && "hidden"
        )}
        aria-label="Abrir NutriGem - Assistente Nutricional"
      >
        <img
          src="/assets/nutrigem-logo.png"
          alt="NutriGem"
          className="w-full h-full object-contain"
        />
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)]",
          "bg-card border border-border rounded-2xl shadow-2xl overflow-hidden",
          "transition-all duration-300 transform",
          "flex flex-col",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        )}
        style={{ height: "500px" }}
      >
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/nutrigem-logo.png"
              alt="NutriGem Logo"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-heading font-semibold flex items-center gap-2">
                NutriGem
              </h3>
              <p className="text-xs opacity-80">Assistente em Saúde Intestinal</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-full hover:bg-primary-foreground/20 transition-colors text-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
          {/* Welcome message always shown */}
          <div className="flex gap-2 justify-start">
            <img
              src="/assets/nutrigem-logo.png"
              alt="NutriGem"
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            <div className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-bl-md text-sm bg-muted text-foreground">
              Olá! 👋 Sou a NutriGem, especialista em dieta FODMAP e saúde intestinal. Como posso ajudar?
            </div>
          </div>

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                "flex gap-2",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "assistant" && (
                <img
                  src="/assets/nutrigem-logo.png"
                  alt="NutriGem"
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
              )}
              <div
                className={cn(
                  "max-w-[80%] px-4 py-2.5 rounded-2xl text-sm",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                )}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex gap-2 justify-start">
              <img
                src="/assets/nutrigem-logo.png"
                alt="NutriGem"
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              <div className="bg-muted px-4 py-2.5 rounded-2xl rounded-bl-md">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        {showPrompts && (
          <div className="px-4 pb-2 flex flex-wrap gap-2 bg-background">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt.label}
                onClick={() => handleQuickPrompt(prompt.message)}
                className="px-3 py-1.5 text-xs rounded-full border border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
              >
                {prompt.label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escreve a tua dúvida..."
              className="flex-1 px-4 py-2.5 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className={cn(
                "px-4 py-2.5 rounded-full text-sm font-medium transition-colors",
                "bg-primary text-primary-foreground hover:bg-primary/90",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Enviar"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
