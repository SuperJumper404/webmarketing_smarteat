<template>
  <section class="bg-white">
    <div class="mx-auto max-w-[86rem] px-4 py-16 sm:px-6 lg:px-8">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="(feature, index) in items"
          :id="feature.id"
          :key="feature.title"
          class="scroll-mt-40 rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition duration-300 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-900/10"
          v-motion="featureMotion(index)"
        >
          <img class="h-20 w-20 object-contain" :src="feature.image" :alt="feature.imageAlt" />
          <h3 class="mt-5 text-lg font-bold text-gray-950">
            {{ feature.title }}
          </h3>
          <p class="mt-2 text-sm leading-6 text-gray-600">
            {{ feature.text }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
});

function featureMotion(index) {
  return {
    initial: { opacity: 0, y: 48, scale: 0.92, filter: "blur(12px)" },
    whileInView: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
    whileHover: { y: -9, scale: 1.025 },
    transition: { duration: 0.72, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] },
    viewport: { once: true, margin: "-10% 0px" },
  };
}
</script>
