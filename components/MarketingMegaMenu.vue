<template>
  <div
    id="product-mega-menu"
    class="mx-auto w-full max-w-[86rem] px-4 sm:px-6 lg:px-8"
    @click="$emit('select')"
  >
    <div
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-950/10"
    >
      <div class="grid gap-8 p-7 lg:grid-cols-[1fr_1fr_0.85fr] lg:p-8">
        <div class="lg:col-span-2">
          <p
            class="text-xs font-bold uppercase tracking-[0.18em] text-primary-700"
          >
            {{ menu.eyebrow }}
          </p>
          <h2 class="mt-2 text-2xl font-bold tracking-tight text-gray-950">
            {{ menu.title }}
          </h2>

          <div class="mt-6 grid gap-6 sm:grid-cols-2">
            <div v-for="group in menu.groups" :key="group.title">
              <p class="mb-2 text-sm font-bold text-gray-950">
                {{ group.title }}
              </p>
              <div class="space-y-1">
                <a
                  v-for="item in group.items"
                  :key="item.id"
                  :href="item.href"
                  class="group flex gap-3 rounded-xl p-3 transition duration-200 hover:bg-primary-50 focus:outline-none focus:ring-4 focus:ring-primary-100"
                >
                  <span
                    class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition group-hover:bg-white group-hover:text-primary-700"
                  >
                    <component
                      :is="iconFor(item.icon)"
                      class="h-5 w-5"
                      aria-hidden="true"
                    />
                  </span>
                  <span>
                    <span
                      class="block text-sm font-bold text-gray-950 transition group-hover:text-primary-700"
                    >
                      {{ item.label }}
                    </span>
                    <span class="mt-1 block text-xs leading-5 text-gray-600">
                      {{ item.description }}
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <a
          :href="menu.spotlight.href"
          class="group flex min-h-64 flex-col justify-between rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-50 via-white to-gray-100 p-6 text-gray-950 transition hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-primary-200"
        >
          <span
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-primary-700 shadow-sm"
          >
            <SparklesIcon class="h-6 w-6" aria-hidden="true" />
          </span>
          <span>
            <span class="block text-xl font-bold">{{ menu.spotlight.title }}</span>
            <span class="mt-2 block text-sm leading-6 text-gray-600">
              {{ menu.spotlight.text }}
            </span>
            <span
              class="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary-700"
            >
              {{ menu.spotlight.label }}
              <ArrowRightIcon
                class="h-4 w-4 transition group-hover:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </span>
        </a>
      </div>

      <a
        :href="menu.roadmap.href"
        class="group flex items-center justify-between gap-6 border-t border-gray-100 bg-gray-50 px-7 py-4 transition hover:bg-primary-50 focus:outline-none focus:ring-4 focus:ring-inset focus:ring-primary-100 lg:px-8"
      >
        <span>
          <span
            class="block text-xs font-bold uppercase tracking-[0.16em] text-primary-700"
          >
            {{ menu.roadmap.eyebrow }}
          </span>
          <span class="mt-1 block text-sm text-gray-600">
            {{ menu.roadmap.text }}
          </span>
        </span>
        <span
          class="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-gray-950 group-hover:text-primary-700"
        >
          {{ menu.roadmap.label }}
          <ArrowRightIcon
            class="h-4 w-4 transition group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </a>
    </div>
  </div>
</template>

<script setup>
import {
  ArrowRightIcon,
  ChartBarSquareIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  QrCodeIcon,
  ShoppingBagIcon,
  SparklesIcon,
  TableCellsIcon,
} from "@heroicons/vue/24/outline";

defineProps({
  menu: {
    type: Object,
    required: true,
  },
});

defineEmits(["select"]);

const icons = {
  qr: QrCodeIcon,
  orders: ClipboardDocumentListIcon,
  collect: ShoppingBagIcon,
  dashboard: ChartBarSquareIcon,
  tables: TableCellsIcon,
  journal: DocumentTextIcon,
};

function iconFor(name) {
  return icons[name] || SparklesIcon;
}
</script>
