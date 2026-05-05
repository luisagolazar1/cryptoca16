import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        {/* PWA crítico */}
        <meta name="application-name" content="CRYPTOCA16" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CRYPTOCA16" />
        <meta name="theme-color" content="#10b981" />
        <link rel="manifest" href="/manifest.json" />
        {/* Iconos */}
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        <link rel="shortcut icon" href="/icon-192.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
        {/* Registro del Service Worker */}
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js', { scope: '/' })
                .then(function(reg) {
                  console.log('[PWA] SW registrado:', reg.scope);
                  // Forzar activación inmediata
                  if (reg.waiting) { reg.waiting.postMessage({ type: 'SKIP_WAITING' }); }
                })
                .catch(function(err) { console.error('[PWA] SW error:', err); });
            });
          }
        `}} />
      </body>
    </Html>
  );
}
