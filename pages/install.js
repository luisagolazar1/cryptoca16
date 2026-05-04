export default function InstallPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center mx-auto mb-6 text-5xl">
            ₿
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">
            CRYPTOCA16
          </h1>
          <p className="text-gray-400 text-lg">Sistema Avanzado de Análisis de Criptomonedas</p>
        </div>

        {/* Android Install */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-green-400 mb-4">📱 Instalar en Android</h2>
          
          <div className="space-y-4">
            <div className="bg-gray-700/30 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-2">Chrome Browser:</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-300 text-sm">
                <li>Abre CRYPTOCA16 en Chrome</li>
                <li>Presiona el menú ⋮ (arriba a la derecha)</li>
                <li>Selecciona "Instalar aplicación" o "Agregar a pantalla de inicio"</li>
                <li>¡Listo! La app aparecerá en tu pantalla de inicio</li>
              </ol>
            </div>

            <div className="bg-gray-700/30 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-2">Firefox Browser:</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-300 text-sm">
                <li>Abre CRYPTOCA16 en Firefox</li>
                <li>Presiona el menú ☰ (arriba a la derecha)</li>
                <li>Toca el ícono de "Agregar a pantalla de inicio"</li>
                <li>¡Hecho! Disfruta de la app nativa</li>
              </ol>
            </div>
          </div>
        </div>

        {/* iOS Install */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-blue-400 mb-4">🍎 Instalar en iPhone/iPad</h2>
          
          <div className="bg-gray-700/30 rounded-lg p-4 space-y-2">
            <ol className="list-decimal list-inside space-y-2 text-gray-300 text-sm">
              <li>Abre Safari y ve a CRYPTOCA16</li>
              <li>Presiona el botón de compartir ⬆️ (abajo al centro)</li>
              <li>Desplázate y toca "Agregar a pantalla de inicio"</li>
              <li>Dale un nombre (puedes dejar "CRYPTOCA16")</li>
              <li>Toca "Agregar" en la esquina superior derecha</li>
              <li>¡Perfecto! Tendrás la app en tu pantalla de inicio</li>
            </ol>
          </div>
        </div>

        {/* Features */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">✨ Ventajas de la App</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <span className="text-2xl">🚀</span>
              <div>
                <h3 className="font-semibold text-white">Acceso Rápido</h3>
                <p className="text-gray-400 text-sm">Abre desde tu pantalla de inicio</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-2xl">📴</span>
              <div>
                <h3 className="font-semibold text-white">Modo Offline</h3>
                <p className="text-gray-400 text-sm">Accede a datos guardados sin conexión</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-2xl">🔔</span>
              <div>
                <h3 className="font-semibold text-white">Notificaciones</h3>
                <p className="text-gray-400 text-sm">Recibe alertas de criptos</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <h3 className="font-semibold text-white">Ultra Rápido</h3>
                <p className="text-gray-400 text-sm">Carga casi instantáneamente</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <h3 className="font-semibold text-white">Privado</h3>
                <p className="text-gray-400 text-sm">Tus datos están seguros localmente</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <h3 className="font-semibold text-white">Análisis Completo</h3>
                <p className="text-gray-400 text-sm">Todas las herramientas disponibles</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 rounded-lg font-bold text-white transition-all text-lg shadow-lg shadow-green-500/30"
          >
            ← Volver a la App
          </a>
        </div>
      </div>
    </div>
  );
}
