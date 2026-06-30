<template>
  <header class="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur">
    <nav
      class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
      aria-label="Navigation principale"
    >
      <a href="#" class="flex items-center gap-3" aria-label="SmartEat accueil">
        <img class="h-11 w-11 rounded-lg object-contain" src="/logo.png" :alt="content.logoAlt" />
        <span class="text-2xl font-bold tracking-tight">
          Smart<span class="text-primary-700">Eat</span>
        </span>
      </a>

      <div class="hidden items-center gap-8 md:flex">
        <a
          v-for="item in content.links"
          :key="item.href"
          :href="item.href"
          class="text-sm font-semibold text-gray-700 transition hover:text-primary-700"
        >
          {{ item.label }}
        </a>
      </div>

      <div class="hidden items-center gap-3 sm:flex">
        <a
          class="text-sm font-semibold text-gray-700 transition hover:text-primary-700"
          :href="footer.phoneHref"
        >
          {{ footer.phone }}
        </a>
        <button
          type="button"
          class="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-primary-200 hover:text-primary-700"
          @click="$emit('login')"
        >
          {{ content.secondaryCta }}
        </button>
        <button
          type="button"
          class="rounded-lg bg-primary-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-800"
          @click="$emit('select', 'demo')"
        >
          {{ content.primaryCta }}
        </button>
      </div>
    </nav>
  </header>
</template>

<script setup>
defineProps({
  content: {
    type: Object,
    required: true,
  },
  footer: {
    type: Object,
    required: true,
  },
});

defineEmits(["select", "login"]);
</script>
