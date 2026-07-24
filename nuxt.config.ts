// https://nuxt.com/docs/api/configuration/nuxt-config

const siteUrl = 'https://www.smarteat.fr';
const siteTitle = 'SmartEat - La plateforme tout-en-un pour gérer votre restaurant';
const siteDescription =
  'SmartEat aide les restaurateurs à digitaliser leur menu, recevoir les commandes par QR code et mieux piloter leur activité.';
const ogImageUrl = `${siteUrl}/og-image.jpg`;
const logoUrl = `${siteUrl}/logo.png`;
const navigationLinks = [
  { name: 'Produit', url: `${siteUrl}/#produit` },
  { name: 'Solution', url: `${siteUrl}/#solution` },
  { name: 'FAQ', url: `${siteUrl}/#faq` },
  { name: 'Contact', url: `${siteUrl}/#contact` },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'SmartEat',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: logoUrl,
        width: 120,
        height: 150,
      },
      sameAs: ['https://www.instagram.com/smart_eat'],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+33 7 45 20 33 43',
          contactType: 'customer support',
          areaServed: 'FR',
          availableLanguage: ['fr'],
        },
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'SmartEat',
      description: siteDescription,
      publisher: {
        '@id': `${siteUrl}/#organization`,
      },
      inLanguage: 'fr-FR',
    },
    {
      '@type': 'ItemList',
      '@id': `${siteUrl}/#site-navigation`,
      name: 'Navigation principale SmartEat',
      itemListElement: navigationLinks.map((link, index) => ({
        '@type': 'SiteNavigationElement',
        position: index + 1,
        name: link.name,
        url: link.url,
      })),
    },
  ],
};

export default defineNuxtConfig({
    ssr: false,
    buildDir: process.env.NUXT_BUILD_DIR || '.nuxt',
    app: {
      head: {
        title: siteTitle,
        meta: [
          {
            name: 'description',
            content: siteDescription,
          },
          {
            property: 'og:type',
            content: 'website',
          },
          {
            property: 'og:url',
            content: siteUrl,
          },
          {
            property: 'og:title',
            content: siteTitle,
          },
          {
            property: 'og:description',
            content: siteDescription,
          },
          {
            property: 'og:image',
            content: ogImageUrl,
          },
          {
            property: 'og:image:secure_url',
            content: ogImageUrl,
          },
          {
            property: 'og:image:type',
            content: 'image/jpeg',
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
            content: siteTitle,
          },
          {
            name: 'twitter:description',
            content: siteDescription,
          },
          {
            name: 'twitter:image',
            content: ogImageUrl,
          },
        ],
        link: [
          {
            rel: 'canonical',
            href: siteUrl,
          },
          {
            rel: 'icon',
            href: '/favicon.ico',
          },
        ],
        script: [
          {
            type: 'application/ld+json',
            innerHTML: JSON.stringify(structuredData),
          },
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
