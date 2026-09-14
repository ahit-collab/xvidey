import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Intercept third-party cross-origin script errors (e.g. from ad networks or tracking scripts)
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    // Suppress generic cross-origin script errors or ad/tracker network errors from bubbling
    if (
      event.message === 'Script error.' ||
      event.message?.includes('Script error') ||
      event.filename?.includes('landslidegraphsystems') ||
      event.filename?.includes('histats')
    ) {
      event.preventDefault();
      return true;
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    // Suppress ad/tracker network rejection errors
    if (
      event.reason?.message?.includes('Failed to fetch') ||
      event.reason?.message?.includes('NetworkError')
    ) {
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

