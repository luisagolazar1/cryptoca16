import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        {/* Charset and Viewport */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no" />

        {/* PWA Configuration */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CRYPTOCA16" />
        
        {/* Theme and Colors */}
        <meta name="theme-color" content="#10b981" />
        <meta name="description" content="CRYPTOCA16 - Sistema Avanzado de Análisis de Criptomonedas" />

        {/* Manifest and Icons */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />

        {/* Splash Screens */}
        <link 
          rel="apple-touch-startup-image" 
          href="/icon-512.png" 
          media="(device-width: 768px) and (device-height: 1024px)"
        />

        {/* Open Graph */}
        <meta property="og:title" content="CRYPTOCA16" />
        <meta property="og:description" content="Sistema Avanzado de Análisis de Criptomonedas" />
        <meta property="og:image" content="/icon-512.png" />
        <meta property="og:url" content="https://cryptoca16.vercel.app" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="CRYPTOCA16" />
        <meta name="twitter:description" content="Sistema Avanzado de Análisis de Criptomonedas" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <body className="bg-black text-white">
        <Main />
        <NextScript />

        {/* Register Service Worker - Improved */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker
                    .register('/sw.js', { scope: '/' })
                    .then((reg) => {
                      console.log('SW registered:', reg);
                    })
                    .catch((err) => {
                      console.log('SW registration failed:', err);
                    });
                });
              }
            `,
          }}
        />

        {/* Prevent zoom on double tap for iOS */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('touchmove', (e) => {
                if (e.touches.length > 1) e.preventDefault();
              }, { passive: false });
            `,
          }}
        />
      </body>
    </Html>
  );
}
