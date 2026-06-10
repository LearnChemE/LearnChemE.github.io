// Load Google Analytics script dynamically
const script = document.createElement('script');
script.src = 'https://www.googletagmanager.com/gtag/js?id=UA-204988035-3';
script.async = true;
document.head.appendChild(script);

// Initialize Google Analytics
window.dataLayer = window.dataLayer || [];

function gtag() {
  dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', 'UA-204988035-3');
