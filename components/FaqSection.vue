<template>
  <section id="faq" class="bg-white">
    <div class="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div class="mt-10 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white" data-reveal>
        <article v-for="faq in items" :key="faq.question" class="p-6">
          <h2 class="text-lg font-bold text-gray-950">
            {{ faq.question }}
          </h2>
          <p class="mt-2 text-base leading-7 text-gray-600">
            {{ faq.answer }}
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
</script>
