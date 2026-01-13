import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Emergency Error Logger to prevent blank pages without feedback
window.onerror = function(message, source, lineno, colno, error) {
  const root = document.getElementById('root');
  if (root && root.innerHTML === '') {
    root.innerHTML = `
      <div style="padding: 20px; color: #ff4444; font-family: sans-serif; background: #020617; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
        <h1 style="font-size: 24px; margin-bottom: 10px;">Oops! Game failed to load.</h1>
        <p style="opacity: 0.7; max-width: 400px; line-height: 1.5;">${message}</p>
        <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #c084fc; border: none; border-radius: 10px; color: white; font-weight: bold; cursor: pointer;">Try Refreshing</button>
      </div>
    `;
  }
  return false;
};

const rootElement = document.getElementById('root');
if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error('Initial render failed:', err);
  }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.debug('ServiceWorker registration failed: ', err);
    });
  });
}