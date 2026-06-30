<template>
  <section class="bg-white">
    <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="feature in items"
          :key="feature.title"
          class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
          data-reveal
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
</script>
