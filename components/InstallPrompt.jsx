import { useEffect, useState } from 'react';

export default function InstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Detectar plataforma
    const userAgent = navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);

    setIsIOS(isAppleDevice);
    setIsAndroid(isAndroidDevice);

    console.log('📱 Platform detected:', {
      iOS: isAppleDevice,
      Android: isAndroidDevice,
      UserAgent: userAgent,
    });

    // Event: beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      console.log('✓ beforeinstallprompt event fired');
      e.preventDefault();
      setInstallPrompt(e);
      setShowBanner(true);
    };

    // Event: appinstalled
    const handleAppInstalled = () => {
      console.log('✓ App installed successfully');
      setShowBanner(false);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Auto-show banner para Android después de 2 segundos
    if (isAndroidDevice && !installPrompt) {
      const timer = setTimeout(() => {
        console.log('📢 Showing banner (timeout)');
        setShowBanner(true);
      }, 2000);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
        clearTimeout(timer);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) {
      console.log('⚠️ No install prompt available');
      return;
    }

    try {
      console.log('📲 Showing install prompt...');
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;

      console.log('✓ User choice:', outcome);
      if (outcome === 'accepted') {
        console.log('✓ Installation accepted');
      } else {
        console.log('✗ Installation dismissed');
      }

      setShowBanner(false);
      setInstallPrompt(null);
    } catch (error) {
      console.error('Error during installation:', error);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  if (!mounted || !showBanner) return null;

  // iOS Instructions
  if (isIOS) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-800 to-transparent backdrop-blur border-t border-blue-500/50 p-4 z-50 safe-area-inset-bottom">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-4 text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>

          <h3 className="text-white font-bold mb-3 text-lg">📱 Instalar CRYPTOCA16</h3>

          <div className="space-y-2 text-sm text-gray-300 mb-4 bg-gray-800/30 p-3 rounded-lg">
            <p className="font-semibold text-blue-400">Pasos:</p>
            <p>1️⃣ Presiona el botón de compartir ⬆️</p>
            <p>2️⃣ Desplázate y toca "Agregar a pantalla"</p>
            <p>3️⃣ Presiona "Agregar"</p>
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

  // Android Banner
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-800 to-transparent backdrop-blur border-t border-green-500/50 p-4 z-50 safe-area-inset-bottom animate-in slide-in-from-bottom">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between gap-3">
          {/* Left Content */}
          <div className="flex items-center gap-3 flex-1">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-lg">
              ₿
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-white font-bold text-sm leading-tight">Instala CRYPTOCA16</h3>
              <p className="text-gray-400 text-xs leading-tight">Acceso rápido desde tu pantalla</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 flex-shrink-0">
            {installPrompt ? (
              <button
                onClick={handleInstall}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 rounded-lg font-semibold text-white transition-all shadow-lg hover:shadow-green-500/50 whitespace-nowrap text-sm"
              >
                Instalar
              </button>
            ) : (
              <button
                onClick={handleDismiss}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 rounded-lg font-semibold text-white transition-all shadow-lg hover:shadow-green-500/50 whitespace-nowrap text-sm"
              >
                Menú ⋮
              </button>
            )}

            <button
              onClick={handleDismiss}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-200 transition-all font-medium text-sm"
            >
              ✕
            </button>
          </div>
        </div>

        {!installPrompt && isAndroid && (
          <p className="text-xs text-gray-500 mt-3 text-center px-2">
            💡 Si no ves "Instalar", presiona menú ⋮ y busca "Instalar aplicación"
          </p>
        )}
      </div>
    </div>
  );
}
