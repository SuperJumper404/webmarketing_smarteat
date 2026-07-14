<template>
  <footer class="border-t border-gray-100 bg-gray-950 text-white">
    <div class="mx-auto flex max-w-[86rem] flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
      <div>
        <p class="text-xl font-bold">
          Smart<span class="text-primary-300">Eat</span>
        </p>
        <p class="mt-2 text-sm text-gray-300">
          {{ content.text }}
        </p>
      </div>
      <div class="flex flex-col gap-2 text-sm text-gray-300 sm:flex-row sm:gap-6">
        <a class="transition hover:text-white" :href="content.phoneHref">{{ content.phone }}</a>
        <a class="transition hover:text-white" :href="content.whatsappHref" target="_blank" rel="noreferrer">
          {{ content.whatsapp }}
        </a>
        <a class="transition hover:text-white" :href="content.emailHref">{{ content.email }}</a>
        <a class="transition hover:text-white" :href="content.instagramHref" target="_blank" rel="noreferrer">
          {{ content.instagram }}
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup>
defineProps({
  content: {
    type: Object,
    required: true,
  },
});
</script>
