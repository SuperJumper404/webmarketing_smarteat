<template>
  <section id="produit" class="border-b border-gray-100 bg-white">
    <div class="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-20">
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

      <div class="relative" v-motion="visualMotion">
        <video
          class="h-auto w-full rounded-lg bg-gray-950 object-contain shadow-xl shadow-primary-900/10"
          :src="content.visual.src"
          :aria-label="content.visual.alt"
          autoplay
          loop
          muted
          playsinline
        />
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

const copyMotion = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
};

const visualMotion = {
  initial: { opacity: 0, y: 32, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] },
};

const titleWords = props.content.title.split(" ");

function wordMotion(index) {
  return {
    initial: { opacity: 0, y: 34, scale: 0.96, filter: "blur(8px)" },
    animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
    transition: {
      duration: 0.58,
      delay: 0.14 + index * 0.055,
      ease: [0.16, 1, 0.3, 1],
    },
  };
}
</script>
