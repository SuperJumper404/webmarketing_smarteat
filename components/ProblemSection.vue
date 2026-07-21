<template>
  <section class="bg-white">
    <div class="mx-auto max-w-[86rem] px-4 py-16 sm:px-6 lg:px-8">
      <div class="w-full" data-reveal>
        <p
          v-if="content.eyebrow"
          class="text-sm font-semibold uppercase tracking-wide text-primary-700"
        >
          {{ content.eyebrow }}
        </p>
        <h2
          class="mb-10 mt-4 w-full text-center text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl lg:text-6xl"
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

      <div class="mt-16 grid gap-5 lg:grid-cols-2">
        <article
          v-for="(problem, index) in normalizedItems"
          :key="problem.title"
          class="problem-card group relative overflow-hidden rounded-2xl border border-transparent bg-white p-3 hover:z-10 focus-within:z-10 sm:p-4"
          :class="[
            index % 2 === 0 ? 'problem-card-left' : 'problem-card-right',
            index < 2 ? 'problem-card-top' : 'problem-card-bottom',
          ]"
          data-reveal
          @mouseenter="playProblemVideo"
          @mouseleave="pauseProblemVideo"
          @focusin="playProblemVideo"
          @focusout="pauseProblemVideo"
        >
          <div
            class="relative aspect-video overflow-hidden rounded-xl bg-gray-950"
          >
            <video
              v-if="problem.video"
              class="problem-card-video h-full w-full object-contain"
              :src="problem.video"
              :poster="problem.poster"
              muted
              playsinline
              preload="metadata"
              aria-hidden="true"
            />
            <img
              v-else-if="problem.image"
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
            class="relative mt-2 min-h-[170px] overflow-hidden rounded-xl bg-transparent p-5 pb-16 text-gray-950 sm:mt-3 sm:min-h-[190px]"
          >
            <div class="max-w-xl pr-2">
              <h3
                class="problem-card-title text-2xl font-bold leading-8 sm:text-3xl sm:leading-9"
              >
                {{ problem.title }}
              </h3>
              <p
                class="problem-card-copy mt-3 text-sm leading-6 text-gray-600 sm:text-base sm:leading-7"
              >
                {{ problem.problem }}
              </p>
              <p
                class="problem-card-copy mt-2 hidden text-sm leading-6 text-gray-500 sm:block sm:text-base sm:leading-7"
              >
                {{ problem.solution }}
              </p>
            </div>

            <a
              href="#solution"
              class="btn-fill-primary absolute bottom-5 right-5 inline-flex translate-y-3 items-center justify-center gap-1.5 rounded-lg bg-primary-700 px-4 py-2 text-sm font-semibold text-white opacity-0 shadow-sm transition duration-300 ease-out hover:shadow-lg hover:shadow-primary-900/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
            >
              En savoir plus
              <span aria-hidden="true">→</span>
            </a>
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

function getProblemVideo(event) {
  return event.currentTarget.querySelector("video");
}

function playProblemVideo(event) {
  const video = getProblemVideo(event);
  if (!video) return;

  video.currentTime = 0;
  video.play().catch(() => {});
}

function pauseProblemVideo(event) {
  const video = getProblemVideo(event);
  if (!video) return;

  video.pause();
}
</script>

<style scoped>
.problem-card {
  --card-hover-x: 0px;
  --card-hover-y: -24px;
  transition:
    transform 0.45s cubic-bezier(0.16, 1, 0.3, 1),
    background-color 0.45s ease,
    border-color 0.45s ease,
    box-shadow 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.problem-card:hover,
.problem-card:focus-within {
  background-color: #f8fafc;
  box-shadow:
    0 32px 72px -24px rgba(15, 23, 42, 0.28),
    0 10px 28px -18px rgba(15, 23, 42, 0.18);
  transform: translate3d(var(--card-hover-x), var(--card-hover-y), 0) scale(1.03);
}

@media (min-width: 1024px) {
  .problem-card-left {
    --card-hover-x: -24px;
  }

  .problem-card-right {
    --card-hover-x: 24px;
  }

  .problem-card-top {
    --card-hover-y: -24px;
  }

  .problem-card-bottom {
    --card-hover-y: 24px;
  }
}

.problem-card-image {
  transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
}

.problem-card-video {
  transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
}

.problem-card:hover .problem-card-video,
.problem-card:focus-within .problem-card-video,
.problem-card:hover .problem-card-image,
.problem-card:focus-within .problem-card-image {
  transform: scale(1.04);
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
