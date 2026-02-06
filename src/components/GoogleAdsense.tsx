import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const GoogleAdsense = () => {
  useEffect(() => {
    try {
      // Inicializa o AdSense quando o componente é montado
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('Erro ao carregar Google AdSense:', error);
    }
  }, []);

  return (
    <div className="w-full my-8">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-7450011513727945"
        data-ad-slot="7937759097"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default GoogleAdsense;
