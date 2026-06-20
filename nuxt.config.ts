// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    ssr: false,
    modules: [
      '@nuxtjs/tailwindcss',
    ],
    plugins: [
      { src: "~/plugins/lottie-player.js", mode: "client" },
      { src: "~/plugins/google-analytics.js", mode: "client" },
      { src: "~/plugins/hotjar.js", mode: "client" },
    ],
    tailwindcss: {
      cssPath: '~/assets/css/tailwind.css',
      configPath: 'tailwind.config',
      exposeConfig: false,
      exposeLevel: 2,
      injectPosition: 'first',
      viewer: true,
    },
    runtimeConfig: {
      public:{
        url: process.env.BACKEND_URL,
        appUrl: process.env.APP_URL || 'https://app.smarteat.fr/login',
        googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
        hotjarId: process.env.HOTJAR_ID,
        test:"Hrllos"
      }
    },
    
  })
