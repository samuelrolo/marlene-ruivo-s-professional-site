import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, ChevronRight, Leaf, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Message = { role: "user" | "assistant"; content: string };

const SUPABASE_URL = 'https://hihzmjqkszcxxdrhnqpy.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpaHptanFrc3pjeHhkcmhucXB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzMjc1ODMsImV4cCI6MjA4MzkwMzU4M30.gKVFx9ZUO8rjtrPDkcUBRToexX2IlmkwZY2S3IgwNkY';
const CHAT_URL = `${SUPABASE_URL}/functions/v1/nutrition-chat`;

const QUICK_PROMPTS = [
  { label: "O que é FODMAP?", message: "O que é FODMAP?" },
  { label: "Tenho sintomas", message: "Tenho sintomas intestinais, como inchaço e desconforto. O que posso fazer?" },
];

// Componente de Avatar Unificado
const NutriGenAvatar = ({ size = "sm" }: { size?: "sm" | "md" }) => {
  const containerClasses = size === "md" 
    ? "w-10 h-10 rounded-full bg-[#F0F7F6] flex items-center justify-center relative border border-[#6FA89E]/30 shadow-sm"
    : "w-8 h-8 rounded-full bg-[#F0F7F6] flex items-center justify-center flex-shrink-0 relative border border-[#6FA89E]/30 shadow-sm";
  
  const textClasses = size === "md" ? "text-xs" : "text-[10px]";
  const leafClasses = size === "md" ? "w-4 h-4" : "w-3 h-3";

  return (
    <div className={containerClasses}>
      <span className={cn("font-bold text-[#6FA89E] tracking-tighter", textClasses)}>NG</span>
      <Leaf className={cn("absolute -right-0.5 -bottom-0.5 text-[#6FA89E] opacity-60 rotate-12", leafClasses)} />
    </div>
  );
};

// Função para converter URLs em links clicáveis
const formatMessageWithLinks = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  
  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      const cleanUrl = part.replace(/[.,;:!?)]+$/, '');
      const trailing = part.slice(cleanUrl.length);
      
      let linkText = "Clique aqui";
      if (cleanUrl.includes("calendar.app.google") || cleanUrl.includes("calendar.google")) {
        linkText = "📅 Agendar Online";
      } else if (cleanUrl.includes("sheerme.com") || cleanUrl.includes("hygeia")) {
        linkText = "📍 Agendar em Mafra";
      } else if (cleanUrl.includes("institutobettencourt")) {
        linkText = "📍 Agendar em Lisboa";
      } else if (cleanUrl.includes("sousiclinica")) {
        linkText = "📍 Agendar em Sintra";
      }
      
      return (
        <span key={index}>
          <a 
            href={cleanUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 my-1 bg-[#6FA89E]/10 text-[#6FA89E] rounded-lg hover:bg-[#6FA89E]/20 transition-colors font-medium text-sm"
          >
            {linkText}
          </a>
          {trailing}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
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
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "apikey": SUPABASE_KEY
        },
        body: JSON.stringify({ messages: [...messages, userMsg] })
      });

      if (!resp.ok) throw new Error("Falha na ligação");
      
      const data = await resp.json();
      const assistantMsg: Message = { 
        role: "assistant", 
        content: data.reply || data.choices?.[0]?.message?.content || "Desculpe, não consegui processar a sua mensagem." 
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Desculpe, ocorreu um erro ao conectar com o assistente. Por favor, tente novamente ou contacte-nos diretamente através do formulário." 
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
      {/* Tab vertical à esquerda - Posicionado no lado oposto ao scroll */}
      <div className={cn(
        "fixed left-0 top-1/2 -translate-y-1/2 z-50 flex items-center",
        "transition-all duration-300",
        isOpen && "-translate-x-full opacity-0 pointer-events-none"
      )}>
        {/* Caixa vertical - mais estreita, arredondada, com bevel */}
        <div 
          className="bg-[#6FA89E] text-white px-2 py-6 flex flex-col items-center gap-4 rounded-r-xl"
          style={{
            boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.1), 2px 0 8px rgba(0,0,0,0.1)'
          }}
        >
          {/* Avatar minimalista NG + Folha */}
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center relative border border-white/30 shadow-inner">
            <span className="text-[10px] font-bold text-white tracking-tighter">NG</span>
            <Leaf className="absolute -right-0.5 -bottom-0.5 w-3 h-3 text-white opacity-80 rotate-12" />
          </div>
          
          {/* Texto vertical - mais fino e elegante */}
          <div className="flex flex-col items-center gap-1 text-xs font-semibold tracking-widest uppercase">
            {'NutriGen'.split('').map((letter, i) => (
              <span key={i} className="leading-none">{letter}</span>
            ))}
          </div>
        </div>

        {/* Botão semi-circular para abrir */}
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#6FA89E] text-white p-3 rounded-r-full shadow-md hover:bg-[#5d8d84] transition-all hover:shadow-lg"
          aria-label="Abrir NutriGen"
        >
          <ChevronRight className="w-5 h-5 animate-pulse" />
        </button>
      </div>

      {/* Janela do chat */}
      <div
        className={cn(
          "fixed z-50 overflow-hidden bg-white border border-gray-200 shadow-2xl transition-all duration-300 transform flex flex-col",
          isMaximized 
            ? "inset-4 md:inset-10 w-auto h-auto rounded-3xl" 
            : "left-6 top-1/2 -translate-y-1/2 w-[380px] max-w-[calc(100vw-3rem)] h-[500px] rounded-2xl",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none -translate-x-8"
        )}
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NutriGenAvatar size="md" />
            <div>
              <h3 className="font-heading font-semibold text-gray-900">NutriGen</h3>
              <p className="text-xs text-gray-500">Assistente em Saúde Intestinal</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setIsMaximized(!isMaximized)} 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
              title={isMaximized ? "Minimizar" : "Maximizar"}
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => {setIsOpen(false); setIsMaximized(false);}} 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          <div className="flex gap-3 justify-start">
            <NutriGenAvatar size="sm" />
            <div className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-bl-md text-sm bg-white text-gray-900 shadow-sm border border-gray-100">
              Olá! 👋 Sou a NutriGen, especialista em dieta FODMAP e saúde intestinal. Como posso ajudar?
            </div>
          </div>

          {messages.map((msg, idx) => (
            <div key={idx} className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}>
              {msg.role === "assistant" && <NutriGenAvatar size="sm" />}
              <div className={cn(
                "max-w-[85%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap shadow-sm", 
                msg.role === "user" 
                  ? "bg-[#6FA89E] text-white rounded-br-md" 
                  : "bg-white text-gray-900 rounded-bl-md border border-gray-100"
              )}>
                {msg.role === "assistant" ? formatMessageWithLinks(msg.content) : msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <NutriGenAvatar size="sm" />
              <div className="bg-white px-4 py-2.5 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
                <Loader2 className="w-4 h-4 animate-spin text-[#6FA89E]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Prompts Rápidos */}
        {showPrompts && (
          <div className="px-4 pb-2 flex flex-wrap gap-2 bg-gray-50">
            {QUICK_PROMPTS.map((prompt) => (
              <button 
                key={prompt.label} 
                onClick={() => handleQuickPrompt(prompt.message)} 
                className="px-3 py-1.5 text-xs rounded-full bg-white text-[#6FA89E] border border-[#6FA89E]/20 hover:bg-[#6FA89E]/5 transition-colors shadow-sm"
              >
                {prompt.label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyPress={handleKeyPress} 
              placeholder="Escreve a tua dúvida..." 
              className="flex-1 px-4 py-2.5 rounded-full border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#6FA89E]/30 focus:border-transparent" 
              disabled={isLoading} 
            />
            <button 
              onClick={() => handleSend()} 
              disabled={!input.trim() || isLoading} 
              className="px-4 py-2.5 rounded-full text-sm font-medium bg-[#6FA89E] text-white hover:bg-[#5d8d84] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
