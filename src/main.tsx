import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import './index.css'
import { updateFavicon } from '@/lib/favicon'

import { Buffer } from 'buffer'

// Polyfill Buffer for browser environment
globalThis.Buffer = Buffer

// Update favicon on app load
updateFavicon();

// Function to remove the initial loader with fade effect
const removeLoader = () => {
  const loader = document.getElementById('initial-loader');
  if (loader) {
    loader.style.opacity = '0';
    loader.style.transition = 'opacity 0.3s ease-out';
    setTimeout(() => loader.remove(), 300);
  }
};

// Make removeLoader available globally so React components can call it
(window as any).removeInitialLoader = removeLoader;

const root = document.getElementById("root")!;
createRoot(root).render(<App />);
