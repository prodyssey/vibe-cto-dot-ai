// Instructions to generate OG image:
// 
// 1. Open og-image-generator.html in a browser
// 2. Open browser developer tools (F12)
// 3. Run this in the console:
//
// To save as PNG:
// - Chrome: Right-click > "Capture node screenshot" on the body element
// - Or use this code in console:

async function downloadOGImage() {
  // Wait for images to load
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Get the body element
  const element = document.body;
  
  // Use html2canvas if available (you'd need to include the library)
  if (typeof html2canvas !== 'undefined') {
    html2canvas(element, {
      width: 1200,
      height: 630,
      scale: 2, // Higher quality
      useCORS: true
    }).then(canvas => {
      // Convert to blob and download
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'vibe-cto-og.png';
        a.click();
        URL.revokeObjectURL(url);
      });
    });
  } else {
    console.log('Please include html2canvas library or use browser DevTools to capture screenshot');
    console.log('In Chrome DevTools: Right-click the <body> element > Capture node screenshot');
  }
}

// Alternative: Manual screenshot instructions
console.log(`
=== OG Image Generation Instructions ===

Option 1 - Browser DevTools (Recommended):
1. Press F12 to open DevTools
2. Click the Elements tab
3. Find the <body> element
4. Right-click on it
5. Select "Capture node screenshot"
6. Save as "vibe-cto-og.png"

Option 2 - Using html2canvas:
1. Add to the HTML: <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
2. Run: downloadOGImage()

The image should be exactly 1200x630 pixels.
`);