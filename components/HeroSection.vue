<template>
  <section id="produit" class="overflow-hidden border-b border-gray-100 bg-white">
    <div
      class="mx-auto grid max-w-[86rem] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:px-8 lg:py-20"
    >
      <div v-motion="copyMotion">
        <h1
          class="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl lg:text-6xl"
          :aria-label="content.title"
        >
          <span
            v-for="(word, index) in titleWords"
            :key="`${word}-${index}`"
            class="mr-[0.22em] inline-block overflow-hidden align-bottom"
            aria-hidden="true"
          >
            <span class="inline-block" v-motion="wordMotion(index)">
              {{ word }}
            </span>
          </span>
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

      <div
        class="relative min-w-0 lg:ml-auto lg:w-[145%] lg:max-w-none lg:translate-x-16 lg:-translate-y-6 xl:w-[160%] xl:translate-x-24"
        v-motion="visualMotion"
      >
        <div
          class="hero-marquee relative h-[280px] w-full min-w-0 overflow-hidden rounded-[1.55rem] sm:h-[360px] lg:h-[430px]"
          :class="{ 'is-dragging': isMarqueeDragging }"
          @pointerdown="startMarqueeDrag"
          @pointermove="dragMarquee"
          @pointerup="stopMarqueeDrag"
          @pointercancel="stopMarqueeDrag"
          @lostpointercapture="stopMarqueeDrag"
          @mouseenter="pauseMarquee"
          @mouseleave="resumeMarquee"
        >
          <div
            ref="marqueeTrack"
            class="hero-marquee-track flex h-full w-max items-center py-0"
            :style="marqueeTrackStyle"
            aria-label="Visuels SmartEat"
          >
            <div
              v-for="groupIndex in 2"
              :key="`marquee-group-${groupIndex}`"
              :ref="groupIndex === 1 ? setMarqueeGroup : undefined"
              class="flex h-full shrink-0 gap-4 pr-4 sm:gap-5 sm:pr-5"
              :aria-hidden="groupIndex === 2"
            >
                <article
                  v-for="slide in carouselSlides"
                  :key="`${slide.src}-${groupIndex}`"
                  class="h-full shrink-0 overflow-hidden rounded-[1.55rem]"
                  :style="{ aspectRatio: getSlideAspectRatio(slide) }"
                >
                  <img
                    class="h-full w-full rounded-[1.55rem] object-cover"
                    draggable="false"
                    :src="slide.src"
                    :alt="groupIndex === 1 ? slide.alt : ''"
                  />
              </article>
            </div>
          </div>
        </div>
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

defineEmits(["select"]);

const marqueeTrack = ref(null);
const marqueeGroup = ref(null);
const marqueeOffset = ref(0);
const isMarqueeDragging = ref(false);
const isMarqueePaused = ref(false);
let marqueeFrame = null;
let marqueeLastTimestamp = 0;
let marqueeGroupWidth = 0;
let dragStartX = 0;
let dragStartOffset = 0;

const carouselSlides = computed(() => {
  if (
    Array.isArray(props.content.visual?.slides) &&
    props.content.visual.slides.length
  ) {
    return props.content.visual.slides;
  }

  return [
    {
      src: props.content.visual?.src || "/appscreen.svg",
      alt: props.content.visual?.alt || "Interface SmartEat",
    },
  ];
});
const marqueeTrackStyle = computed(() => ({
  transform: `translate3d(${marqueeOffset.value}px, 0, 0)`,
}));
const copyMotion = {
  initial: { opacity: 0, y: 44, scale: 0.98, filter: "blur(10px)" },
  animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
};

const visualMotion = {
  initial: { opacity: 0, x: 44, y: 20, scale: 0.98 },
  animate: { opacity: 1, x: 0, y: 0, scale: 1 },
  transition: { duration: 1, delay: 0.18, ease: [0.16, 1, 0.3, 1] },
};

const titleWords = props.content.title.split(" ");

onMounted(() => {
  marqueeFrame = requestAnimationFrame(animateMarquee);
});

onUnmounted(() => {
  if (marqueeFrame) {
    cancelAnimationFrame(marqueeFrame);
  }
});

function setMarqueeGroup(element) {
  if (element) {
    marqueeGroup.value = element;
    marqueeGroupWidth = element.offsetWidth;
  }
}

function updateMarqueeWidth() {
  if (marqueeGroup.value) {
    marqueeGroupWidth = marqueeGroup.value.offsetWidth;
  }
}

function animateMarquee(timestamp) {
  if (!marqueeLastTimestamp) {
    marqueeLastTimestamp = timestamp;
  }

  const delta = Math.min((timestamp - marqueeLastTimestamp) / 1000, 0.05);
  marqueeLastTimestamp = timestamp;

  if (!isMarqueeDragging.value && !isMarqueePaused.value) {
    updateMarqueeWidth();
    marqueeOffset.value -= 32 * delta;
    normalizeMarqueeOffset();
  }

  marqueeFrame = requestAnimationFrame(animateMarquee);
}

function normalizeMarqueeOffset() {
  if (!marqueeGroupWidth) return;

  while (marqueeOffset.value <= -marqueeGroupWidth) {
    marqueeOffset.value += marqueeGroupWidth;
  }

  while (marqueeOffset.value > 0) {
    marqueeOffset.value -= marqueeGroupWidth;
  }
}

function startMarqueeDrag(event) {
  isMarqueeDragging.value = true;
  dragStartX = event.clientX;
  dragStartOffset = marqueeOffset.value;
  event.currentTarget.setPointerCapture(event.pointerId);
}

function dragMarquee(event) {
  if (!isMarqueeDragging.value) return;

  marqueeOffset.value = dragStartOffset + event.clientX - dragStartX;
  normalizeMarqueeOffset();
}

function stopMarqueeDrag(event) {
  if (!isMarqueeDragging.value) return;

  isMarqueeDragging.value = false;

  if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
    event.currentTarget.releasePointerCapture(event.pointerId);
  }
}

function pauseMarquee() {
  isMarqueePaused.value = true;
}

function resumeMarquee() {
  isMarqueePaused.value = false;
}

function getSlideAspectRatio(slide) {
  if (slide.src === "/hero-iphone-menu.png") {
    return "356 / 716";
  }

  if (slide.src === "/hero-iphone-menu-transparent.png") {
    return "1098 / 2134";
  }

  return "3 / 2";
}

function wordMotion(index) {
  return {
    initial: { opacity: 0, y: 54, scale: 0.9, filter: "blur(12px)" },
    animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
    transition: {
      duration: 0.72,
      delay: 0.18 + index * 0.075,
      ease: [0.16, 1, 0.3, 1],
    },
  };
}
</script>

<style scoped>
.hero-marquee {
  cursor: grab;
  touch-action: pan-y;
  user-select: none;
}

.hero-marquee.is-dragging {
  cursor: grabbing;
}

.hero-marquee-track {
  will-change: transform;
}
</style>
