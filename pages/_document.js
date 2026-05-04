import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        {/* PWA Meta Tags */}
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="CRYPTOCA16 - Sistema Avanzado de Análisis de Criptomonedas" />
        
        {/* iOS App Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CRYPTOCA16" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        
        {/* Android Chrome */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        
        {/* Favicon */}
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#10b981" />
        
        {/* Splash Screens para iOS */}
        <link rel="apple-touch-startup-image" href="/splash-640x1136.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/splash-750x1334.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/splash-1242x2208.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="CRYPTOCA16" />
        <meta property="og:description" content="Sistema Avanzado de Análisis de Criptomonedas" />
        <meta property="og:image" content="/icon-512.png" />
        <meta property="og:url" content="https://cryptoca16.vercel.app" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CRYPTOCA16" />
        <meta name="twitter:description" content="Sistema Avanzado de Análisis de Criptomonedas" />
        <meta name="twitter:image" content="/icon-512.png" />
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <body className="bg-black text-white">
        <Main />
        <NextScript />
        
        {/* Register Service Worker */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('Service Worker registered:', registration);
                    },
                    function(error) {
                      console.log('Service Worker registration failed:', error);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </Html>
  );
}
