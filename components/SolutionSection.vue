<template>
  <section id="solution" class="scroll-mt-24 bg-gray-50">
    <div class="mx-auto max-w-[86rem] px-4 py-16 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl text-center" data-reveal>
        <p class="text-sm font-semibold uppercase tracking-wide text-primary-700">
          {{ content.eyebrow }}
        </p>
        <h2 class="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
          {{ content.title }}
        </h2>
        <p class="mt-4 text-base leading-7 text-gray-600">
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
