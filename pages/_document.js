import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        {/* Charset y Viewport - CRÍTICOS */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no" />

        {/* PWA Meta Tags - ESENCIALES */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CRYPTOCA16" />
        <meta name="theme-color" content="#10b981" />
        <meta name="color-scheme" content="dark" />
        
        {/* Description */}
        <meta name="description" content="Sistema Avanzado de Análisis de Criptomonedas - Instala como app" />

        {/* Manifest - LA CLAVE */}
        <link rel="manifest" href="/manifest.json" />

        {/* Icons */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        <link rel="shortcut icon" href="/icon-192.png" />

        {/* Open Graph */}
        <meta property="og:title" content="CRYPTOCA16" />
        <meta property="og:description" content="Sistema Avanzado de Análisis de Criptomonedas" />
        <meta property="og:image" content="/icon-512.png" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <body className="bg-black text-white">
        <Main />
        <NextScript />

        {/* Service Worker Registration */}
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js', { scope: '/' })
                  .then(reg => console.log('✓ SW registered'))
                  .catch(err => console.log('✗ SW error:', err));
              });
            }
          `
        }} />
      </body>
    </Html>
  );
}
