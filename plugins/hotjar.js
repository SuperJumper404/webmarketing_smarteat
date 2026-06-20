export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const hotjarId = config.public.hotjarId;

  if (!hotjarId) {
    console.warn('HotJar ID not configured');
    return;
  }

  // Inject HotJar tracking code
  window.hj =
    window.hj ||
    function () {
      (window.hj.q = window.hj.q || []).push(arguments);
    };
  window._hjSettings = {
    hjid: hotjarId,
    hjsv: 6,
  };

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://static.hotjar.com/c/hotjar-${hotjarId}.js?sv=6`;
  document.head.appendChild(script);
});