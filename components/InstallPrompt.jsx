import { useEffect, useState } from 'react';

export default function InstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Detectar plataforma
    const userAgent = navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);
    
    setIsIOS(isAppleDevice);
    setIsAndroid(isAndroidDevice);

    // Escuchar evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowBanner(true);
    };

    // Si ya está instalada, no mostrar
    window.addEventListener('appinstalled', () => {
      setShowBanner(false);
      setInstallPrompt(null);
    });

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Mostrar banner si es Android (aunque no haya beforeinstallprompt)
    if (isAndroidDevice && !installPrompt) {
      setTimeout(() => {
        setShowBanner(true);
      }, 2000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [installPrompt]);

  const handleInstall = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('App instalada');
    }
    
    setShowBanner(false);
    setInstallPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  // iOS - Instrucciones de instalación
  if (isIOS) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-800 to-transparent backdrop-blur border-t border-blue-500/50 p-4 z-50 safe-area-inset-bottom">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-4 text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>
          
          <h3 className="text-white font-bold mb-3 text-lg">📱 Instalar CRYPTOCA16</h3>
          
          <div className="space-y-2 text-sm text-gray-300 mb-4">
            <p>1️⃣ Presiona el botón de compartir ⬆️ (abajo al centro)</p>
            <p>2️⃣ Desplázate y toca "Agregar a pantalla de inicio"</p>
            <p>3️⃣ Dale un nombre y presiona "Agregar"</p>
          </div>

          <button
            onClick={handleDismiss}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white transition-all"
          >
            Entendido
          </button>
        </div>
      </div>
    );
  }

  // Android - Banner de instalación
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-800 to-transparent backdrop-blur border-t border-green-500/50 p-4 z-50 safe-area-inset-bottom animate-in slide-in-from-bottom">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-lg">
            ₿
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-white font-bold text-base leading-tight">Instala CRYPTOCA16</h3>
            <p className="text-gray-400 text-xs leading-tight">Acceso rápido desde tu pantalla de inicio</p>
          </div>
        </div>
        
        <div className="flex gap-2 flex-shrink-0">
          {installPrompt ? (
            <button
              onClick={handleInstall}
              className="px-5 py-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 rounded-lg font-semibold text-white transition-all whitespace-nowrap shadow-lg hover:shadow-green-500/50"
            >
              Instalar
            </button>
          ) : (
            <button
              onClick={handleDismiss}
              className="px-5 py-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 rounded-lg font-semibold text-white transition-all whitespace-nowrap shadow-lg hover:shadow-green-500/50"
            >
              Menú ⋮
            </button>
          )}
          
          <button
            onClick={handleDismiss}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-200 transition-all font-medium"
          >
            ✕
          </button>
        </div>
      </div>
      
      {!installPrompt && isAndroid && (
        <p className="text-xs text-gray-500 mt-3 text-center">
          💡 Tip: Si no ves el botón "Instalar", presiona el menú ⋮ y selecciona "Instalar aplicación"
        </p>
      )}
    </div>
  );
}
