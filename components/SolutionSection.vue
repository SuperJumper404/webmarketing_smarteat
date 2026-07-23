<template>
  <section id="solution" class="scroll-mt-24 bg-gray-50">
    <div class="mx-auto max-w-[86rem] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div class="mx-auto w-full max-w-5xl text-center" data-reveal>
        <p class="text-sm font-semibold uppercase tracking-wide text-primary-700">
          {{ content.eyebrow }}
        </p>
        <h2 class="mt-4 text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
          {{ content.title }}
        </h2>
        <p class="mx-auto mt-5 max-w-3xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
          {{ content.text }}
        </p>
      </div>

      <div class="mt-16 grid gap-x-6 gap-y-24 pt-16 sm:grid-cols-2 sm:gap-y-28 sm:pt-28 lg:grid-cols-3 lg:gap-y-6">
        <article
          v-for="(card, index) in content.cards"
          :key="card.id"
          class="group flex h-full flex-col overflow-visible rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-gray-900/10 focus-within:-translate-y-2 focus-within:shadow-xl motion-reduce:transform-none motion-reduce:transition-none sm:p-5"
          :class="index === 2 ? 'sm:col-span-2 sm:mx-auto sm:w-[calc(50%-0.75rem)] lg:col-span-1 lg:w-auto' : ''"
          data-reveal
        >
          <div class="relative aspect-[4/3] overflow-visible rounded-xl bg-white">
            <img
              class="absolute inset-x-0 bottom-0 z-10 h-[calc(100%+4.25rem)] w-full object-contain p-3 transition duration-500 group-hover:scale-[1.025] group-focus-within:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none sm:h-[calc(100%+6.5rem)] sm:p-4"
              :src="card.image"
              :alt="card.imageAlt"
            />
          </div>

          <div class="flex flex-1 flex-col px-1 pb-1 pt-6">
            <h3 class="text-2xl font-bold leading-8 text-gray-950">
              {{ card.title }}
            </h3>
            <p class="mb-7 mt-3 text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
              {{ card.text }}
            </p>
            <a
              :href="card.href"
              class="btn-fill-outline mt-auto inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-primary-700 px-4 text-sm font-semibold text-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100"
            >
              {{ card.ctaLabel }}
              <ArrowRightIcon class="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </article>
      </div>

      <div class="mt-8 rounded-2xl border border-primary-100 bg-primary-50/70 p-6 sm:p-8" data-reveal>
        <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex max-w-3xl items-start gap-4">
            <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-primary-700 shadow-sm">
              <ArrowsRightLeftIcon class="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.16em] text-primary-700">
                {{ content.sync.eyebrow }}
              </p>
              <h3 class="mt-2 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                {{ content.sync.title }}
              </h3>
              <p class="mt-2 text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
                {{ content.sync.text }}
              </p>
            </div>
          </div>

          <div class="flex flex-wrap gap-2 lg:justify-end" aria-label="Points de commande synchronisés">
            <span
              v-for="item in content.sync.items"
              :key="item"
              class="rounded-full border border-primary-200 bg-white px-4 py-2 text-sm font-bold text-primary-800"
            >
              {{ item }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ArrowRightIcon, ArrowsRightLeftIcon } from "@heroicons/vue/24/outline";

defineProps({
  content: {
    type: Object,
    required: true,
  },
});
</script>
