// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    ssr: false,
    buildDir: process.env.NUXT_BUILD_DIR || '.nuxt',
    app: {
      head: {
        title: 'SmartEat - Menu QR, commande et caisse pour restaurants',
        meta: [
          {
            name: 'description',
            content:
              'SmartEat aide les restaurateurs à digitaliser leur menu, recevoir les commandes par QR code et mieux piloter leur activité.',
          },
          {
            property: 'og:type',
            content: 'website',
          },
          {
            property: 'og:url',
            content: 'https://www.smarteat.fr',
          },
          {
            property: 'og:title',
            content: 'SmartEat - Menu QR, commande et caisse pour restaurants',
          },
          {
            property: 'og:description',
            content:
              'SmartEat aide les restaurateurs à digitaliser leur menu, recevoir les commandes par QR code et mieux piloter leur activité.',
          },
          {
            property: 'og:image',
            content: 'https://www.smarteat.fr/og-image.png',
          },
          {
            property: 'og:image:width',
            content: '1200',
          },
          {
            property: 'og:image:height',
            content: '630',
          },
          {
            name: 'twitter:card',
            content: 'summary_large_image',
          },
          {
            name: 'twitter:title',
            content: 'SmartEat - Menu QR, commande et caisse pour restaurants',
          },
          {
            name: 'twitter:description',
            content:
              'SmartEat aide les restaurateurs à digitaliser leur menu, recevoir les commandes par QR code et mieux piloter leur activité.',
          },
          {
            name: 'twitter:image',
            content: 'https://www.smarteat.fr/og-image.png',
          },
        ],
        link: [
          {
            rel: 'canonical',
            href: 'https://www.smarteat.fr',
          },
        ],
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
