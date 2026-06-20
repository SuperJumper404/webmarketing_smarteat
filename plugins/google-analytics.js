export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const analyticsId = config.public.googleAnalyticsId;

  if (!analyticsId) {
    console.warn('Google Analytics ID not configured');
    return;
  }

  // Inject Google Analytics 4 script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', analyticsId);

  // Make gtag available globally if needed
  window.gtag = gtag;
});