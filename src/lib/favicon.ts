export const generateFaviconSVG = () => {
  const svg = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="6" fill="#0F172A"/>
    <path d="M 10 10 L 7 10 L 7 16 L 7 22 L 10 22" stroke="url(#gradient)" stroke-width="2" stroke-linecap="round" fill="none"/>
    <path d="M 11.5 16 Q 14 13, 16 16 T 20.5 16" stroke="url(#gradient)" stroke-width="2" stroke-linecap="round" fill="none"/>
    <path d="M 22 10 L 25 10 L 25 16 L 25 22 L 22 22" stroke="url(#gradient)" stroke-width="2" stroke-linecap="round" fill="none"/>
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#3B82F6"/>
        <stop offset="50%" stop-color="#8B5CF6"/>
        <stop offset="100%" stop-color="#EC4899"/>
      </linearGradient>
    </defs>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

export const updateFavicon = () => {
  // Remove existing favicon
  const existingLink = document.querySelector("link[rel*='icon']");
  if (existingLink) {
    existingLink.remove();
  }

  // Add new favicon
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = generateFaviconSVG();
  document.head.appendChild(link);
};
