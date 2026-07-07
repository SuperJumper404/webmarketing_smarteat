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

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 45, 320)}ms`;
    observer.observe(item);
  });
});
</script>

<style>
html {
  scroll-behavior: smooth;
}

[data-reveal] {
  opacity: 0;
  filter: blur(10px);
  transform: translateY(34px) scale(0.97);
  transition: opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1),
    filter 0.75s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, filter, transform;
}

[data-reveal].is-visible {
  opacity: 1;
  filter: blur(0);
  transform: translateY(0) scale(1);
}

[data-reveal].is-visible:hover {
  transition-delay: 0ms !important;
}

.btn-fill-primary {
  background-image: linear-gradient(90deg, #6b21a8 0%, #6b21a8 50%, #7e22ce 50%, #7e22ce 100%);
  background-position: 100% 0;
  background-size: 220% 100%;
  transition: background-position 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    color 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-fill-primary:hover {
  background-position: 0 0;
}

.btn-fill-outline {
  background-image: linear-gradient(90deg, #7e22ce 0%, #7e22ce 50%, transparent 50%, transparent 100%);
  background-position: 100% 0;
  background-size: 220% 100%;
  transition: background-position 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    color 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-fill-outline:hover {
  background-position: 0 0;
  color: #fff;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  [data-reveal] {
    opacity: 1;
    filter: none;
    transform: none;
    transition: none;
  }

  .transition {
    transition: none !important;
  }

  .btn-fill-primary,
  .btn-fill-outline {
    background-position: 100% 0;
  }
}
</style>
