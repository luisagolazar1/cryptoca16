import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <meta name="application-name" content="FXCA16 CRYPTO" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="FXCA16 CRYPTO" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#c026d3" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script dangerouslySetInnerHTML={{ __html: `
          if('serviceWorker' in navigator){
            window.addEventListener('load',function(){
              navigator.serviceWorker.register('/sw.js',{scope:'/'});
            });
          }
        `}} />
      </body>
    </Html>
  )
}
