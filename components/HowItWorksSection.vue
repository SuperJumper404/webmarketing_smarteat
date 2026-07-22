<template>
  <section id="contact" class="scroll-mt-24 bg-gray-50">
    <div class="mx-auto max-w-[86rem] px-4 py-16 sm:px-6 lg:px-8">
      <div class="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div data-reveal>
          <p class="text-sm font-semibold uppercase tracking-wide text-primary-700">
            {{ content.eyebrow }}
          </p>
          <h2 class="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            {{ content.title }}
          </h2>
        </div>

        <ol class="grid gap-4 sm:grid-cols-2">
          <li
            v-for="(step, index) in content.steps"
            :key="step.title"
            class="rounded-lg border border-gray-200 bg-white p-5 transition duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:border-primary-200 hover:shadow-lg hover:shadow-primary-900/10"
            data-reveal
          >
            <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-700 text-sm font-bold text-white">
              {{ index + 1 }}
            </span>
            <h3 class="mt-4 text-base font-bold text-gray-950">
              {{ step.title }}
            </h3>
            <p class="mt-2 text-sm leading-6 text-gray-600">
              {{ step.text }}
            </p>
          </li>
        </ol>
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
