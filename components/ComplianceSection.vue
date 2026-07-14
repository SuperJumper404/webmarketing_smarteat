<template>
  <section class="bg-white">
    <div class="mx-auto max-w-[86rem] px-4 py-16 sm:px-6 lg:px-8">
      <div
        class="rounded-lg border border-primary-100 bg-primary-50 p-6 transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-900/10 sm:p-8"
        data-reveal
      >
        <p class="text-sm font-semibold uppercase tracking-wide text-primary-700">
          {{ content.eyebrow }}
        </p>
        <h2 class="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
          {{ content.title }}
        </h2>
        <p class="mt-4 max-w-3xl text-base leading-7 text-gray-700">
          {{ content.text }}
        </p>
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
</script>
