<template>
  <section class="bg-gray-50">
    <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl text-center" data-reveal>
        <p class="text-sm font-semibold uppercase tracking-wide text-primary-700">
          {{ content.eyebrow }}
        </p>
        <h2 class="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
          {{ content.title }}
        </h2>
      </div>

      <div class="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <p
          v-for="item in content.items"
          :key="item"
          class="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition duration-300 hover:-translate-y-1 hover:scale-[1.015] hover:border-primary-200 hover:bg-primary-50 hover:text-primary-800 hover:shadow-md hover:shadow-primary-900/10"
          data-reveal
        >
          {{ item }}
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
