import { useEffect, useState } from 'react';

export default function InstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detectar iOS
    const isAppleDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isAppleDevice);

    // Escuchar evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Escuchar si la app ya fue instalada
    window.addEventListener('appinstalled', () => {
      console.log('App instalada');
      setShowBanner(false);
      setInstallPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('App instalada por usuario');
    }
    
    setShowBanner(false);
    setInstallPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  // Banner Android
  if (!showBanner && !isIOS) return null;

  if (isIOS && showBanner) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-gray-800 border-t border-green-500/50 p-4 z-50">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          ✕
        </button>
        <h3 className="text-white font-bold mb-2">📱 Instalar CRYPTOCA16</h3>
        <p className="text-sm text-gray-300 mb-3">
          Abre el menú de compartir y selecciona "Agregar a pantalla de inicio"
        </p>
        <div className="flex gap-2">
          <div className="flex-1 bg-gray-700/50 rounded p-2 text-xs text-gray-400">
            1. Presiona el botón de compartir ⬆️
          </div>
        </div>
      </div>
    );
  }

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-800 to-transparent backdrop-blur border-t border-green-500/50 p-4 z-50 animate-in slide-in-from-bottom">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            ₿
          </div>
          <div className="min-w-0">
            <h3 className="text-white font-bold text-sm">Instala CRYPTOCA16</h3>
            <p className="text-gray-400 text-xs">Acceso rápido desde tu pantalla de inicio</p>
          </div>
        </div>
        
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleInstall}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 rounded-lg font-semibold text-white transition-all whitespace-nowrap"
          >
            Instalar
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-200 transition-all"
          >
            Después
          </button>
        </div>
      </div>
    </div>
  );
}
