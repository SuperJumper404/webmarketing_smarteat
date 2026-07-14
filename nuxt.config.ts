// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    ssr: false,
    buildDir: process.env.NUXT_BUILD_DIR || '.nuxt',
    app: {
      head: {
        script: [
          { src: '/runtime-config.js' },
        ],
      },
    },
    modules: [
      '@nuxtjs/tailwindcss',
    ],
    plugins: [
      { src: "~/plugins/motion-v.client.js", mode: "client" },
      { src: "~/plugins/google-analytics.js", mode: "client" },
      { src: "~/plugins/hotjar.js", mode: "client" },
    ],
    tailwindcss: {
      cssPath: '~/assets/css/tailwind.css',
      configPath: 'tailwind.config',
      exposeConfig: false,
      exposeLevel: 2,
      injectPosition: 'first',
      viewer: false,
    },
    runtimeConfig: {
      public:{
        url: process.env.BACKEND_URL,
        appUrl: process.env.APP_URL || 'https://app.smarteat.fr/login',
        supabaseUrl: process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL,
        supabaseAnonKey: process.env.SUPABASE_ANON_KEY || process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
        googleAnalyticsId:
          process.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ID ||
          process.env.GOOGLE_ANALYTICS_ID,
        hotjarId: process.env.HOTJAR_ID,
        test:"Hrllos"
      }
    },
    
  })
