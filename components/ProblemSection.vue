<template>
  <section class="bg-white">
    <div class="mx-auto max-w-[86rem] px-4 py-16 sm:px-6 lg:px-8">
      <div class="max-w-3xl" data-reveal>
        <p
          v-if="content.eyebrow"
          class="text-sm font-semibold uppercase tracking-wide text-primary-700"
        >
          {{ content.eyebrow }}
        </p>
        <h2
          class="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl"
        >
          <template
            v-for="part in titleParts"
            :key="`${part.text}-${part.highlight}`"
          >
            <span :class="part.highlight ? 'text-primary-700' : ''">
              {{ part.text }}
            </span>
          </template>
        </h2>
      </div>

      <div class="mt-10 grid gap-5 lg:grid-cols-2">
        <article
          v-for="(problem, index) in normalizedItems"
          :key="problem.title"
          class="problem-card group overflow-hidden rounded-2xl border border-transparent bg-white p-3 hover:-translate-y-2 hover:scale-[1.02] hover:border-primary-200 hover:bg-gray-950 hover:shadow-xl hover:shadow-primary-900/10 focus-within:-translate-y-2 focus-within:scale-[1.02] focus-within:border-primary-200 focus-within:bg-gray-950 focus-within:shadow-xl focus-within:shadow-primary-900/10 sm:p-4"
          data-reveal
        >
          <div
            class="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-950"
          >
            <img
              v-if="problem.image"
              class="problem-card-image h-full w-full object-cover hover:scale-105"
              :src="problem.image"
              :alt="problem.imageAlt || problem.title"
            />
            <div
              v-else
              class="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-900 via-primary-700 to-gray-950"
            >
              <span class="text-7xl font-bold text-white/20">
                {{ index + 1 }}
              </span>
            </div>
          </div>

          <div
            class="relative mt-2 min-h-[170px] overflow-hidden rounded-xl bg-transparent p-5 text-gray-950 transition-colors duration-500 ease-out group-hover:text-white group-focus-within:text-white sm:mt-3 sm:min-h-[190px]"
          >
            <div class="max-w-xl pr-2">
              <h3
                class="problem-card-title text-2xl font-bold leading-7 sm:text-3xl sm:leading-8"
              >
                {{ problem.title }}
              </h3>
              <p
                class="problem-card-copy mt-3 text-sm leading-6 text-gray-600 transition-colors duration-500 ease-out group-hover:text-white/90 group-focus-within:text-white/90 sm:text-base sm:leading-7"
              >
                {{ problem.problem }}
              </p>
              <p
                class="problem-card-copy mt-2 hidden text-sm leading-6 text-gray-500 transition-colors duration-500 ease-out group-hover:text-white/80 group-focus-within:text-white/80 sm:block"
              >
                {{ problem.solution }}
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  content: {
    type: Object,
    required: true,
  },
});

const normalizedItems = props.content.items.map((item) => {
  if (typeof item === "string") {
    return {
      title: item,
      problem: item,
      solution:
        "SmartEat vous aide a structurer ce point dans une experience simple et centralisee.",
    };
  }

  return item;
});

const titleParts = getHighlightedTitleParts(props.content.title, "tout-en-un");

function getHighlightedTitleParts(title, highlightedText) {
  const index = title.toLowerCase().indexOf(highlightedText.toLowerCase());

  if (index === -1) {
    return [{ text: title, highlight: false }];
  }

  return [
    { text: title.slice(0, index), highlight: false },
    {
      text: title.slice(index, index + highlightedText.length),
      highlight: true,
    },
    { text: title.slice(index + highlightedText.length), highlight: false },
  ].filter((part) => part.text);
}
</script>

<style scoped>
.problem-card {
  transition:
    transform 1.2s ease,
    background-color 0.5s ease,
    border-color 0.5s ease,
    box-shadow 0.5s ease;
}

.problem-card-image {
  transition: transform 1.2s ease;
}

.problem-card-title,
.problem-card-copy {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.problem-card-title {
  -webkit-line-clamp: 2;
}

.problem-card-copy {
  -webkit-line-clamp: 2;
}

</style>
