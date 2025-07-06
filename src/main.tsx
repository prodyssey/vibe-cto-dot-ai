import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import './index.css'
import { updateFavicon } from './components/Favicon'

import { Buffer } from 'buffer'

// Polyfill Buffer for browser environment
globalThis.Buffer = Buffer

// Update favicon on app load
updateFavicon();

createRoot(document.getElementById("root")!).render(<App />);
