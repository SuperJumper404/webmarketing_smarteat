<template>
  <div
    class="flex flex-col gap-3 sm:flex-row sm:items-center"
    :class="centered ? 'sm:justify-center' : ''"
  >
    <button
      type="button"
      class="rounded-lg bg-primary-700 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-200"
      v-motion="primaryMotion"
      @click="$emit('select', 'demo')"
    >
      {{ primaryLabel }}
    </button>
    <button
      type="button"
      class="rounded-lg border border-primary-700 px-6 py-3 text-base font-semibold text-primary-700 transition hover:bg-primary-50 focus:outline-none focus:ring-4 focus:ring-primary-100"
      v-motion="secondaryMotion"
      @click="$emit('select', 'account')"
    >
      {{ secondaryLabel }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  primaryLabel: {
    type: String,
    default: "Demander une demo",
  },
  secondaryLabel: {
    type: String,
    default: "Creer mon espace SmartEat",
  },
  centered: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["select"]);

const primaryMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  whileHover: { y: -2, scale: 1.02 },
  whilePress: { scale: 0.98 },
  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
};

const secondaryMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  whileHover: { y: -2, scale: 1.02 },
  whilePress: { scale: 0.98 },
  transition: { duration: 0.22, delay: 0.04, ease: [0.22, 1, 0.36, 1] },
};
</script>
