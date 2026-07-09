<template>
  <section id="produit" class="border-b border-gray-100 bg-white">
    <div class="mx-auto grid max-w-[86rem] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:px-8 lg:py-20">
      <div v-motion="copyMotion">
        <p class="text-sm font-semibold uppercase tracking-wide text-primary-700">
          {{ content.eyebrow }}
        </p>
        <h1
          class="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl lg:text-6xl"
          :aria-label="content.title"
        >
          <span
            v-for="(word, index) in titleWords"
            :key="`${word}-${index}`"
            class="mr-[0.22em] inline-block overflow-hidden align-bottom"
            aria-hidden="true"
          >
            <span class="inline-block" v-motion="wordMotion(index)">
              {{ word }}
            </span>
          </span>
        </h1>
        <p class="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
          {{ content.subtitle }}
        </p>
        <p class="mt-4 max-w-2xl text-base leading-7 text-gray-700">
          {{ content.supportingText }}
        </p>
        <div class="mt-8">
          <MarketingCta
            :primary-label="content.primaryCta"
            :secondary-label="content.secondaryCta"
            @select="$emit('select', $event)"
          />
        </div>
      </div>

      <div
        class="relative mb-16 lg:-translate-y-8"
        v-motion="visualMotion"
        @mouseenter="pauseCarousel"
        @mouseleave="resumeCarousel"
      >
        <div class="relative aspect-[3/2] overflow-hidden rounded-lg border border-gray-100 bg-gray-100 shadow-xl shadow-primary-900/10">
          <img
            v-for="(slide, index) in carouselSlides"
            :key="slide.src"
            class="absolute inset-0 h-full w-full object-contain transition duration-700 ease-out"
            :class="
              activeSlide === index
                ? 'z-10 opacity-100 scale-100 blur-0'
                : 'z-0 opacity-0 scale-105 blur-sm'
            "
            :src="slide.src"
            :alt="slide.alt"
          />
          <div class="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-24 bg-gradient-to-t from-gray-950/35 to-transparent" />
        </div>

        <div
          v-if="carouselSlides.length > 1"
          class="absolute -bottom-16 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white/95 px-2 py-1.5 shadow-lg shadow-gray-950/10 backdrop-blur"
          aria-label="Navigation du carousel"
        >
          <button
            type="button"
            class="flex h-6 w-6 items-center justify-center rounded-full text-gray-700 transition hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-200"
            aria-label="Visuel precedent"
            @click="previousSlide"
          >
            <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M12.79 15.71a1 1 0 0 1-1.41 0l-5-5a1 1 0 0 1 0-1.42l5-5a1 1 0 1 1 1.41 1.42L8.5 10l4.29 4.29a1 1 0 0 1 0 1.42Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          <button
            v-for="(slide, index) in carouselSlides"
            :key="`${slide.src}-dot`"
            type="button"
            class="h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
            :class="activeSlide === index ? 'w-6 bg-primary-700' : 'w-2 bg-gray-300 hover:bg-primary-300'"
            :aria-label="`Afficher le visuel ${index + 1}`"
            @click="setSlide(index)"
          />
          <button
            type="button"
            class="flex h-6 w-6 items-center justify-center rounded-full text-gray-700 transition hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-200"
            aria-label="Visuel suivant"
            @click="nextSlide"
          >
            <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M7.21 4.29a1 1 0 0 1 1.41 0l5 5a1 1 0 0 1 0 1.42l-5 5a1 1 0 1 1-1.41-1.42L11.5 10 7.21 5.71a1 1 0 0 1 0-1.42Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  content: {
    type: Object,
    required: true,
  },
});

defineEmits(["select"]);

const activeSlide = ref(0);
const carouselTimer = ref(null);
const carouselSlides = computed(() => {
  if (Array.isArray(props.content.visual?.slides) && props.content.visual.slides.length) {
    return props.content.visual.slides;
  }

  return [
    {
      src: props.content.visual?.src || "/appscreen.svg",
      alt: props.content.visual?.alt || "Interface SmartEat",
    },
  ];
});

const copyMotion = {
  initial: { opacity: 0, y: 44, scale: 0.98, filter: "blur(10px)" },
  animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
};

const visualMotion = {
  initial: { opacity: 0, x: 54, y: 28, rotate: 1.5, scale: 0.92 },
  animate: { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 },
  whileHover: { y: -6, scale: 1.015, rotate: -0.4 },
  transition: { duration: 1, delay: 0.18, ease: [0.16, 1, 0.3, 1] },
};

const titleWords = props.content.title.split(" ");

onMounted(() => {
  resumeCarousel();
});

onUnmounted(() => {
  pauseCarousel();
});

function pauseCarousel() {
  if (!carouselTimer.value) return;
  clearInterval(carouselTimer.value);
  carouselTimer.value = null;
}

function resumeCarousel() {
  if (carouselTimer.value || carouselSlides.value.length <= 1) return;
  carouselTimer.value = setInterval(() => {
    nextSlide(false);
  }, 3200);
}

function setSlide(index, restartTimer = true) {
  activeSlide.value = index;

  if (restartTimer) {
    pauseCarousel();
    resumeCarousel();
  }
}

function nextSlide(restartTimer = true) {
  setSlide((activeSlide.value + 1) % carouselSlides.value.length, restartTimer);
}

function previousSlide() {
  setSlide((activeSlide.value - 1 + carouselSlides.value.length) % carouselSlides.value.length);
}

function wordMotion(index) {
  return {
    initial: { opacity: 0, y: 54, scale: 0.9, filter: "blur(12px)" },
    animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
    transition: {
      duration: 0.72,
      delay: 0.18 + index * 0.075,
      ease: [0.16, 1, 0.3, 1],
    },
  };
}
</script>
