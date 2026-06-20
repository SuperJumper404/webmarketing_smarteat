<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:items-center" :class="centered ? 'sm:justify-center' : ''">
    <button
      type="button"
      class="rounded-lg bg-primary-700 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-200"
      @click="$emit('select', 'demo')"
    >
      Demander une demo
    </button>
    <button
      type="button"
      class="rounded-lg border border-primary-700 px-6 py-3 text-base font-semibold text-primary-700 transition hover:bg-primary-50 focus:outline-none focus:ring-4 focus:ring-primary-100"
      @click="$emit('select', 'account')"
    >
      Creer mon compte
    </button>
  </div>
</template>

<script setup>
defineProps({
  centered: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["select"]);
</script>
