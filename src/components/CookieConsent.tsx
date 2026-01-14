import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed bottom-6 left-6 right-6 md:left-auto md:right-24 md:max-w-md z-[60]",
      "bg-white border border-gray-200 rounded-2xl shadow-2xl p-6",
      "animate-in fade-in slide-in-from-bottom-4 duration-500"
    )}>
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <h4 className="font-heading font-semibold text-gray-900">Valorizamos a sua privacidade 🍪</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            Utilizamos cookies para melhorar a sua experiência de navegação e analisar o nosso tráfego. 
            Ao clicar em "Aceitar", concorda com a nossa utilização de cookies.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleAccept}
            className="flex-1 bg-[#6FA89E] hover:bg-[#5d8d84] text-white rounded-full transition-colors"
          >
            Aceitar
          </Button>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors px-2"
          >
            Recusar
          </button>
        </div>
      </div>
    </div>
  );
};
