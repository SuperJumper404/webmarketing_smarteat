<template>
  <section class="bg-white">
    <div class="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <div
        class="rounded-lg border border-primary-100 bg-primary-50 px-6 py-10 sm:px-10"
        v-motion="panelMotion"
      >
        <h2 class="mx-auto max-w-4xl text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
          {{ content.title }}
        </h2>
        <p class="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-700">
          {{ content.text }}
        </p>
        <div class="mt-8 flex justify-center">
          <MarketingCta
            centered
            :primary-label="content.primaryCta"
            :secondary-label="content.secondaryCta"
            @select="$emit('select', $event)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  content: {
    type: Object,
    required: true,
  },
});

defineEmits(["select"]);

const panelMotion = {
  initial: { opacity: 0, y: 54, scale: 0.94, filter: "blur(14px)" },
  whileInView: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  whileHover: { y: -5, scale: 1.01 },
  transition: { duration: 0.82, ease: [0.16, 1, 0.3, 1] },
  viewport: { once: true, margin: "-12% 0px" },
};
</script>
