<template>
  <section id="produit" class="border-b border-gray-100 bg-white">
    <div class="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-20">
      <div data-reveal>
        <p class="text-sm font-semibold uppercase tracking-wide text-primary-700">
          {{ content.eyebrow }}
        </p>
        <h1 class="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
          {{ content.title }}
        </h1>
        <p class="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
          {{ content.subtitle }}
        </p>
        <p class="mt-4 max-w-2xl text-base leading-7 text-gray-700">
          {{ content.supportingText }}
        </p>
        <div class="mt-8">
          <MarketingCta
            :primary-label="content.primaryCta"
            :secondary-label="content.secondaryCta"
            @select="$emit('select', $event)"
          />
        </div>
      </div>

      <div class="relative" data-reveal>
        <img
          class="aspect-[4/3] w-full rounded-lg bg-gray-50 p-6 object-contain shadow-xl shadow-primary-900/10"
          :src="content.visual.src"
          :alt="content.visual.alt"
        />
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
</script>
