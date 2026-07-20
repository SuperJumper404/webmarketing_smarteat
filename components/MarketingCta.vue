<template>
  <div
    class="flex flex-col gap-3 sm:flex-row sm:items-center"
    :class="centered ? 'sm:justify-center' : ''"
  >
    <button
      type="button"
      class="btn-fill-primary inline-flex items-center justify-center gap-2 rounded-lg bg-primary-700 px-6 py-3 text-base font-semibold text-white shadow-sm hover:shadow-lg hover:shadow-primary-900/20 focus:outline-none focus:ring-4 focus:ring-primary-200"
      v-motion="primaryMotion"
      @click="$emit('select', 'demo')"
    >
      <QrCodeIcon class="h-5 w-5" aria-hidden="true" />
      {{ primaryLabel }}
    </button>
    <button
      type="button"
      class="btn-fill-outline inline-flex items-center justify-center gap-2 rounded-lg border border-primary-700 px-6 py-3 text-base font-semibold text-primary-700 hover:shadow-md hover:shadow-primary-900/10 focus:outline-none focus:ring-4 focus:ring-primary-100"
      v-motion="secondaryMotion"
      @click="$emit('select', 'account')"
    >
      <PhoneIcon class="h-5 w-5" aria-hidden="true" />
      {{ secondaryLabel }}
    </button>
  </div>
</template>

<script setup>
import { PhoneIcon, QrCodeIcon } from "@heroicons/vue/24/solid";

defineProps({
  primaryLabel: {
    type: String,
    default: "Demander une démo",
  },
  secondaryLabel: {
    type: String,
    default: "Parlez à un expert",
  },
  centered: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["select"]);

const primaryMotion = {
  initial: { opacity: 0, y: 22, scale: 0.94, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  whileHover: { y: -5, scale: 1.045 },
  whilePress: { scale: 0.96 },
  transition: { duration: 0.42, delay: 0.34, ease: [0.16, 1, 0.3, 1] },
};

const secondaryMotion = {
  initial: { opacity: 0, y: 22, scale: 0.94, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  whileHover: { y: -5, scale: 1.045 },
  whilePress: { scale: 0.96 },
  transition: { duration: 0.42, delay: 0.42, ease: [0.16, 1, 0.3, 1] },
};
</script>
