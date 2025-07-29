import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import './index.css'
import { updateFavicon } from './components/Favicon'

import { Buffer } from 'buffer'

// Polyfill Buffer for browser environment
globalThis.Buffer = Buffer

// Update favicon on app load
updateFavicon();

// Remove initial loader when React mounts
const removeLoader = () => {
  const loader = document.getElementById('initial-loader');
  if (loader) {
    loader.style.opacity = '0';
    loader.style.transition = 'opacity 0.3s ease-out';
    setTimeout(() => loader.remove(), 300);
  }
};

const root = document.getElementById("root")!;
createRoot(root).render(<App />);

// Remove loader after React renders
setTimeout(removeLoader, 100);
