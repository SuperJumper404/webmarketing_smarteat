<template>
  <section class="bg-white">
    <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div class="max-w-3xl" data-reveal>
        <p class="text-sm font-semibold uppercase tracking-wide text-primary-700">
          {{ content.eyebrow }}
        </p>
        <h2 class="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
          {{ content.title }}
        </h2>
      </div>

      <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <article
          v-for="problem in content.items"
          :key="problem"
          class="rounded-lg border border-gray-200 bg-white p-5 transition duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:border-primary-200 hover:shadow-lg hover:shadow-primary-900/10"
          data-reveal
        >
          <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-lg font-bold text-primary-700">
            !
          </div>
          <p class="text-base font-semibold leading-7 text-gray-900">
            {{ problem }}
          </p>
        </article>
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
