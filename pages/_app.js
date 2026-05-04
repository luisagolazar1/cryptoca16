import '../styles/globals.css';
import InstallPrompt from '../components/InstallPrompt';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>CRYPTOCA16 - Análisis de Criptomonedas</title>
        <meta name="description" content="Sistema Avanzado de Análisis y Predicción de Criptomonedas" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>
      
      {/* Install Prompt */}
      <InstallPrompt />
      
      {/* Componente principal */}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
