<template>
  <div class="min-h-screen bg-white text-gray-900">
    <MarketingHeader
      :content="content.navigation"
      :footer="content.footer"
      @select="openOnboarding"
      @login="handleLoginClick"
    />

    <main>
      <HeroSection :content="content.hero" @select="openOnboarding" />
      <BenefitsSection :items="content.benefits" />
      <ProblemSection :content="content.problem" />
      <SolutionSection :content="content.solution" />
      <FeaturesSection :items="content.features" />
      <HowItWorksSection :content="content.howItWorks" />
      <ComplianceSection :content="content.compliance" />
      <RoadmapSection :content="content.roadmap" />
      <FaqSection :items="content.faq" />
      <FinalCtaSection :content="content.finalCta" @select="openOnboarding" />
    </main>

    <MarketingFooter :content="content.footer" />

    <LeadOnboarding
      :open="onboardingOpen"
      :intent="onboardingIntent"
      :content="content.onboarding"
      @close="onboardingOpen = false"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import content from "./content/smarteat.fr.json";

const config = useRuntimeConfig();
const onboardingOpen = ref(false);
const onboardingIntent = ref("demo");
const appLoginUrl = ref(config.public.appUrl || "https://app.smarteat.fr/login");

useHead({
  title: content.meta.title,
  meta: [
    {
      name: "description",
      content: content.meta.description,
    },
  ],
});

function openOnboarding(intent) {
  onboardingIntent.value = intent === "account" ? "account" : "demo";
  onboardingOpen.value = true;
}

function handleLoginClick() {
  window.location.href = appLoginUrl.value;
}

onMounted(() => {
  const revealItems = document.querySelectorAll("[data-reveal]");

  if (!revealItems.length) {
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
});
</script>

<style>
html {
  scroll-behavior: smooth;
}

[data-reveal] {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.55s ease, transform 0.55s ease;
  will-change: opacity, transform;
}

[data-reveal].is-visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  [data-reveal] {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .transition {
    transition: none !important;
  }
}
</style>
