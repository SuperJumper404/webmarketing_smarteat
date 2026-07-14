<template>
  <header class="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur">
    <nav
      class="mx-auto flex max-w-[86rem] items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
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

      <div class="hidden items-end gap-4 sm:flex">
        <a class="font-sans text-center leading-tight tracking-tight" :href="footer.phoneHref">
          <span class="block text-sm font-bold text-primary-700">À votre écoute !</span>
          <span class="block text-base font-bold text-gray-800">{{ footer.phone }}</span>
        </a>
        <a
          class="btn-fill-outline inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-primary-700 px-4 text-sm font-semibold text-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100"
          :href="footer.phoneHref"
        >
          <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fill-rule="evenodd"
              d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.15A1.5 1.5 0 0 1 6.1 3.13l.62 2.49a1.5 1.5 0 0 1-.43 1.47l-.75.75a11.03 11.03 0 0 0 6.62 6.62l.75-.75a1.5 1.5 0 0 1 1.47-.43l2.49.62A1.5 1.5 0 0 1 18 15.35v1.15a1.5 1.5 0 0 1-1.5 1.5H15C7.82 18 2 12.18 2 5V3.5Z"
              clip-rule="evenodd"
            />
          </svg>
          {{ content.secondaryCta }}
        </a>
        <button
          type="button"
          class="btn-fill-primary h-9 rounded-lg bg-primary-700 px-4 text-sm font-semibold text-white shadow-sm hover:shadow-md hover:shadow-primary-900/20"
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
