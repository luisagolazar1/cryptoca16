import '../styles/globals.css';
import Head from 'next/head';
import { useEffect } from 'react';
import InstallPrompt from '../components/InstallPrompt';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Verificar que la PWA está correctamente configurada
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => {
          console.log(`✓ Service Workers activos: ${registrations.length}`);
          registrations.forEach((reg) => {
            console.log(`  - Scope: ${reg.scope}`);
          });
        });
    }

    // Verificar manifest
    fetch('/manifest.json')
      .then((res) => {
        if (res.ok) {
          console.log('✓ manifest.json accesible');
        } else {
          console.error('✗ manifest.json no encontrado (status:', res.status + ')');
        }
      })
      .catch((err) => console.error('✗ Error loading manifest:', err));

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      console.log('✓ App instalada exitosamente');
    });

    return () => {
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);

  return (
    <>
      <Head>
        <title>CRYPTOCA16 - Análisis de Criptomonedas</title>
        <meta name="description" content="Sistema Avanzado de Análisis y Predicción de Criptomonedas en Tiempo Real" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="theme-color" content="#10b981" />
      </Head>

      {/* Install Prompt Component */}
      <InstallPrompt />

      {/* Main App */}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
