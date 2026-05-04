import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        {/* Charset - IMPORTANTE */}
        <meta charSet="utf-8" />
        
        {/* Viewport - CRÍTICO PARA PWA */}
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no, maximum-scale=1.0" 
        />

        {/* PWA - Meta Tags Esenciales */}
        <meta name="theme-color" content="#10b981" />
        <meta name="description" content="CRYPTOCA16 - Sistema Avanzado de Análisis de Criptomonedas en Tiempo Real" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CRYPTOCA16" />
        
        {/* Manifest - FUNDAMENTAL PARA GOOGLE */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Icons */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        <link rel="shortcut icon" href="/favicon.svg" />

        {/* Color Scheme */}
        <meta name="color-scheme" content="dark" />
        
        {/* Open Graph */}
        <meta property="og:title" content="CRYPTOCA16" />
        <meta property="og:description" content="Sistema Avanzado de Análisis de Criptomonedas en Tiempo Real" />
        <meta property="og:image" content="/icon-512.png" />
        <meta property="og:url" content="https://cryptoca16.vercel.app" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CRYPTOCA16" />
        <meta name="twitter:description" content="Sistema Avanzado de Análisis de Criptomonedas" />
        <meta name="twitter:image" content="/icon-512.png" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
      </Head>
      <body className="bg-black text-white">
        <Main />
        <NextScript />

        {/* Service Worker Registration - SCRIPT CRÍTICO */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js', { scope: '/' })
                    .then(function(registration) {
                      console.log('✓ Service Worker registered:', registration.scope);
                    })
                    .catch(function(error) {
                      console.log('✗ Service Worker registration failed:', error);
                    });
                });
              } else {
                console.log('Service Workers not supported');
              }
            `,
          }}
        />
      </body>
    </Html>
  );
}
