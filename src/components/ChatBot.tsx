import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

type Message = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/nutrition-chat`;

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

  const streamChat = async (userMessages: Message[]) => {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: userMessages }),
    });

    if (!resp.ok || !resp.body) {
      const errorData = await resp.json().catch(() => ({}));
      throw new Error(errorData.error || "Erro ao conectar com o assistente");
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let assistantContent = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantContent += content;
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant") {
                return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent } : m));
              }
              return [...prev, { role: "assistant", content: assistantContent }];
            });
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }
  };

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setShowPrompts(false);
    setIsLoading(true);

    try {
      await streamChat([...messages, userMsg]);
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
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full",
          "bg-primary text-primary-foreground shadow-lg hover:shadow-xl",
          "transition-all duration-300 hover:scale-105",
          "flex items-center justify-center",
          isOpen && "hidden"
        )}
        aria-label="Abrir GeniNutri - Assistente Nutricional"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          <path d="M12 7c-2.5 0-4.5 2-4.5 4.5 0 1.5.7 2.8 1.8 3.7l-.3 1.8 1.8-.6c.4.1.8.1 1.2.1 2.5 0 4.5-2 4.5-4.5S14.5 7 12 7z" fill="hsl(var(--background))" />
        </svg>
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
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-semibold flex items-center gap-2">
                GeniNutri
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
            <div className="w-8 h-8 rounded-full bg-sage-light flex-shrink-0 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-primary" />
            </div>
            <div className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-bl-md text-sm bg-muted text-foreground">
              Olá! 👋 Sou a GeniNutri, especialista em dieta FODMAP e saúde intestinal. Como posso ajudar?
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
                <div className="w-8 h-8 rounded-full bg-sage-light flex-shrink-0 flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-primary" />
                </div>
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
              <div className="w-8 h-8 rounded-full bg-sage-light flex-shrink-0 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-primary" />
              </div>
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