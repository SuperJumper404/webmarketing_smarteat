<template>
  <section class="bg-gray-50">
    <div class="mx-auto max-w-[86rem] px-4 py-8 sm:px-6 lg:px-8">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="(benefit, index) in items"
          :key="benefit.title"
          class="rounded-lg border border-gray-200 bg-white p-5 transition duration-300 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-900/10"
          v-motion="cardMotion(index)"
        >
          <h2 class="text-lg font-bold text-gray-950">
            {{ benefit.title }}
          </h2>
          <p class="mt-2 text-sm leading-6 text-gray-600">
            {{ benefit.text }}
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

function cardMotion(index) {
  return {
    initial: { opacity: 0, y: 42, scale: 0.94, filter: "blur(10px)" },
    whileInView: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
    whileHover: { y: -8, scale: 1.025 },
    transition: { duration: 0.68, delay: index * 0.11, ease: [0.16, 1, 0.3, 1] },
    viewport: { once: true, margin: "-8% 0px" },
  };
}
</script>
