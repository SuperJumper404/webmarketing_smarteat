<template>
  <div class="min-h-screen bg-white text-gray-900">
    <header class="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur">
      <nav
        class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
        aria-label="Navigation principale"
      >
        <a href="#" class="flex items-center gap-3" aria-label="SmartEat accueil">
          <img class="h-11 w-11 rounded-lg object-contain" src="/logo.png" alt="SmartEat" />
          <span class="text-2xl font-bold tracking-tight">
            Smart<span class="text-primary-700">Eat</span>
          </span>
        </a>

        <div class="hidden items-center gap-8 md:flex">
          <a
            v-for="item in navItems"
            :key="item.href"
            :href="item.href"
            class="text-sm font-semibold text-gray-700 transition hover:text-primary-700"
          >
            {{ item.label }}
          </a>
        </div>

        <div class="flex items-center gap-4">
          <a
            href="tel:0745203343"
            class="hidden text-sm font-semibold text-gray-700 transition hover:text-primary-700 sm:inline-flex"
          >
            ☎️ 07 45 20 33 43
          </a>
          <button
            @click="handleLoginClick"
            class="hidden rounded-lg bg-primary-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-800 sm:inline-flex"
          >
            Se connecter
          </button>
          <a
            href="#demarrage"
            class="hidden rounded-lg border border-primary-700 px-4 py-2 text-sm font-semibold text-primary-700 transition hover:bg-primary-50 sm:inline-flex"
          >
            Demarrer
          </a>
        </div>
      </nav>
    </header>

    <main>
      <section id="produit" class="border-b border-gray-100 bg-white">
        <div class="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-20">
          <div>
            <p class="text-sm font-semibold uppercase tracking-wide text-primary-700">
              Menu QR, commande et service
            </p>
            <h1 class="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
              Le menu QR et la prise de commande prets pour votre restaurant.
            </h1>
            <p class="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              SmartEat vous aide a digitaliser votre menu, recevoir les commandes
              et fluidifier le service. Notre equipe prepare votre espace et vous
              rappelle sous 24h pour une demo adaptee a votre etablissement.
            </p>
            <div class="mt-8">
              <MarketingCta @select="openOnboarding" />
            </div>
            <div class="mt-8 grid gap-3 text-sm text-gray-700 sm:grid-cols-3">
              <div
                v-for="proof in heroProofs"
                :key="proof"
                class="rounded-lg border border-primary-100 bg-primary-50 px-4 py-3 font-semibold text-primary-900"
              >
                {{ proof }}
              </div>
            </div>
          </div>

          <div class="relative">
            <img
              class="aspect-[4/3] w-full rounded-lg object-cover shadow-xl shadow-primary-900/10"
              src="/imggroupclean.jpg"
              alt="Clients utilisant un menu digital SmartEat"
            />
            <div class="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm lg:absolute lg:bottom-6 lg:left-6 lg:mt-0 lg:max-w-sm">
              <p class="text-sm font-semibold text-gray-950">
                Une experience claire des le premier scan.
              </p>
              <p class="mt-1 text-sm leading-6 text-gray-600">
                Menu, table, commande et suivi rassembles dans un parcours simple.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-gray-50">
        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div class="grid gap-3 text-center text-sm font-semibold text-gray-700 sm:grid-cols-2 lg:grid-cols-4">
            <p
              v-for="item in reassurance"
              :key="item"
              class="rounded-lg border border-gray-200 bg-white px-4 py-3"
            >
              {{ item }}
            </p>
          </div>
        </div>
      </section>

      <section class="bg-white">
        <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div class="max-w-3xl">
            <p class="text-sm font-semibold uppercase tracking-wide text-primary-700">
              Ce que SmartEat simplifie
            </p>
            <h2 class="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              Les irritants du service ne devraient pas freiner vos ventes.
            </h2>
          </div>
          <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <article
              v-for="problem in problems"
              :key="problem"
              class="rounded-lg border border-gray-200 bg-white p-5"
            >
              <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-lg font-bold text-primary-700">
                !
              </div>
              <p class="text-base font-semibold leading-7 text-gray-900">
                {{ problem }}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="solution" class="bg-gray-50">
        <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div class="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p class="text-sm font-semibold uppercase tracking-wide text-primary-700">
                Solution
              </p>
              <h2 class="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                Un espace pour presenter, commander et piloter.
              </h2>
              <p class="mt-4 text-base leading-7 text-gray-600">
                SmartEat rassemble les essentiels d'un menu QR moderne et d'une
                prise de commande adaptee au rythme de la salle.
              </p>
              <img
                class="mt-8 hidden w-full max-w-md lg:block"
                src="/appscreen.svg"
                alt="Apercu de l'application SmartEat"
              />
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <article
                v-for="feature in features"
                :key="feature.title"
                class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
              >
                <img class="h-20 w-20" :src="feature.image" :alt="feature.title" />
                <h3 class="mt-5 text-lg font-bold text-gray-950">
                  {{ feature.title }}
                </h3>
                <p class="mt-2 text-sm leading-6 text-gray-600">
                  {{ feature.text }}
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="demarrage" class="bg-white">
        <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div class="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p class="text-sm font-semibold uppercase tracking-wide text-primary-700">
                Demarrage
              </p>
              <h2 class="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                Demarrer sans perdre une semaine en configuration.
              </h2>
              <p class="mt-4 text-base leading-7 text-gray-600">
                Vous donnez les premieres informations, puis notre equipe vous
                accompagne avec une demo concrete pour votre restaurant.
              </p>
              <div class="mt-8">
                <MarketingCta @select="openOnboarding" />
              </div>
            </div>

            <ol class="grid gap-4 sm:grid-cols-2">
              <li
                v-for="(step, index) in steps"
                :key="step"
                class="rounded-lg border border-gray-200 bg-gray-50 p-5"
              >
                <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-700 text-sm font-bold text-white">
                  {{ index + 1 }}
                </span>
                <p class="mt-4 text-base font-semibold leading-7 text-gray-900">
                  {{ step }}
                </p>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section id="faq" class="bg-gray-50">
        <div class="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div class="text-center">
            <p class="text-sm font-semibold uppercase tracking-wide text-primary-700">
              FAQ
            </p>
            <h2 class="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              Questions frequentes
            </h2>
          </div>
          <div class="mt-10 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
            <article v-for="faq in faqs" :key="faq.question" class="p-6">
              <h3 class="text-lg font-bold text-gray-950">
                {{ faq.question }}
              </h3>
              <p class="mt-2 text-base leading-7 text-gray-600">
                {{ faq.answer }}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section class="bg-white">
        <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div class="rounded-lg border border-primary-100 bg-primary-50 px-6 py-10 text-center sm:px-10">
            <h2 class="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              Votre espace SmartEat peut etre prepare aujourd'hui.
            </h2>
            <p class="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-700">
              Partagez le nom de votre restaurant et votre numero. Nous vous
              rappelons sous 24h pour cadrer la demo et la mise en route.
            </p>
            <div class="mt-8 flex justify-center">
              <MarketingCta centered @select="openOnboarding" />
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="border-t border-gray-100 bg-gray-950 text-white">
      <div class="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p class="text-xl font-bold">
            Smart<span class="text-primary-300">Eat</span>
          </p>
          <p class="mt-2 text-sm text-gray-300">
            Menu QR et prise de commande pour restaurants.
          </p>
        </div>
        <div class="flex flex-col gap-2 text-sm text-gray-300 sm:flex-row sm:gap-6">
          <a class="transition hover:text-white" href="tel:0745203343">
            ☎️ 07 45 20 33 43
          </a>
          <a class="transition hover:text-white" href="https://wa.me/33745203343" target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          <a class="transition hover:text-white" href="mailto:admin@smarteat.fr">
            admin@smarteat.fr
          </a>
          <a class="transition hover:text-white" href="https://www.instagram.com/smart_eat" target="_blank" rel="noreferrer">
            Instagram smart_eat
          </a>
        </div>
      </div>
    </footer>

    <LeadOnboarding
      :open="onboardingOpen"
      :intent="onboardingIntent"
      @close="onboardingOpen = false"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";

const config = useRuntimeConfig();
const onboardingOpen = ref(false);
const onboardingIntent = ref("demo");

// URL de l'application SmartEat - à configurer dans les variables d'environnement
const appLoginUrl = ref(config.public.appUrl || "https://app.smarteat.fr/login");

function openOnboarding(intent) {
  onboardingIntent.value = intent === "account" ? "account" : "demo";
  onboardingOpen.value = true;
}

function handleLoginClick() {
  // À l'avenir: vérifier si un shop existe via le backend
  // Pour maintenant, redirection simple vers l'app
  window.location.href = appLoginUrl.value;
}

const navItems = [
  { label: "Produit", href: "#produit" },
  { label: "Solution", href: "#solution" },
  { label: "Demarrage", href: "#demarrage" },
  { label: "FAQ", href: "#faq" },
];

const heroProofs = ["Menu digital", "Commandes centralisees", "Rappel sous 24h"];

const reassurance = [
  "Adapte aux restaurants",
  "Simple pour les snacks",
  "Clair pour les cafes",
  "Pense pour le service a table",
];

const problems = [
  "Menus papier difficiles a mettre a jour",
  "Commandes prises trop lentement",
  "Erreurs entre la salle et la preparation",
  "Clients qui attendent sans visibilite",
];

const features = [
  {
    title: "Menu QR personnalisable",
    text: "Vos clients scannent, consultent le menu et accedent aux options de commande.",
    image: "/menupersonnalisable.svg",
  },
  {
    title: "Prise de commande",
    text: "Centralisez les commandes et reduisez les erreurs pendant le service.",
    image: "/prisedecommande.svg",
  },
  {
    title: "Plan de table et QR codes",
    text: "Organisez vos tables et preparez des QR codes adaptes a votre salle.",
    image: "/tableplan.svg",
  },
  {
    title: "Tableau de bord",
    text: "Suivez l'activite de votre restaurant depuis un espace clair.",
    image: "/dashbord.svg",
  },
];

const steps = [
  "Vous renseignez le nom de votre restaurant.",
  "On recupere votre numero pour vous rappeler sous 24h.",
  "On prepare votre espace SmartEat avec vos premieres infos.",
  "Vous voyez la demo avec un cas concret pour votre etablissement.",
];

const faqs = [
  {
    question: "Combien de temps faut-il pour demarrer ?",
    answer:
      "Nous vous rappelons sous 24h apres votre demande pour preparer une demo et cadrer la mise en route.",
  },
  {
    question: "Ai-je besoin d'un menu digital existant ?",
    answer: "Non. Vous pouvez partir d'un PDF, d'un site web, de photos ou d'un menu papier.",
  },
  {
    question: "Est-ce adapte aux petits restaurants ?",
    answer:
      "Oui. Le parcours vise d'abord les restaurants independants, snacks, cafes et etablissements avec service a table.",
  },
  {
    question: "Les deux boutons font-ils la meme chose ?",
    answer:
      "Oui. Demander une demo et Creer mon compte ouvrent le meme onboarding, avec une intention differente pour notre equipe.",
  },
];
</script>

<style>
html {
  scroll-behavior: smooth;
}
</style>
