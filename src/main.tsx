import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { updateFavicon } from './components/Favicon'

// Update favicon on app load
updateFavicon();

createRoot(document.getElementById("root")!).render(<App />);
