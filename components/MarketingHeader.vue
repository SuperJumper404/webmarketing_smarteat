<template>
  <header
    ref="headerRef"
    class="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur"
  >
    <nav
      class="mx-auto flex max-w-[86rem] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8"
      aria-label="Navigation principale"
    >
      <button
        type="button"
        class="flex items-center gap-3 rounded-lg pr-2 text-left focus:outline-none focus:ring-4 focus:ring-primary-100 lg:hidden"
        :aria-expanded="mobileMenuOpen"
        aria-controls="mobile-navigation"
        :aria-label="mobileMenuOpen ? 'Fermer le menu SmartEat' : 'Ouvrir le menu SmartEat'"
        @click="toggleMobileMenu"
      >
        <img
          class="h-11 w-11 rounded-lg object-contain"
          src="/logo.png"
          :alt="content.logoAlt"
        />
        <span class="text-2xl font-bold tracking-tight">
          Smart<span class="text-primary-700">Eat</span>
        </span>
        <ChevronDownIcon
          class="h-4 w-4 text-gray-500 transition"
          :class="{ 'rotate-180': mobileMenuOpen }"
          aria-hidden="true"
        />
      </button>

      <a
        href="#"
        class="hidden shrink-0 items-center gap-3 lg:flex"
        aria-label="SmartEat accueil"
      >
        <img
          class="h-11 w-11 rounded-lg object-contain"
          src="/logo.png"
          :alt="content.logoAlt"
        />
        <span class="text-2xl font-bold tracking-tight">
          Smart<span class="text-primary-700">Eat</span>
        </span>
      </a>

      <div class="hidden items-center gap-5 lg:flex xl:gap-7">
        <div
          v-if="megaMenu"
          @mouseenter="scheduleMegaMenuOpen"
          @mouseleave="scheduleMegaMenuClose"
        >
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg px-1 py-2 text-sm font-semibold text-gray-700 transition hover:text-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100"
            :aria-expanded="desktopMegaMenuOpen"
            aria-controls="product-mega-menu"
            @click="toggleMegaMenu"
            @keydown.enter.prevent="toggleMegaMenu"
            @keydown.space.prevent="toggleMegaMenu"
          >
            {{ megaMenu.label }}
            <ChevronDownIcon
              class="h-4 w-4 transition"
              :class="{ 'rotate-180 text-primary-700': desktopMegaMenuOpen }"
              aria-hidden="true"
            />
          </button>
        </div>

        <a
          v-else
          href="#solution"
          class="text-sm font-semibold text-gray-700 transition hover:text-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100"
        >
          Produit
        </a>

        <a
          v-for="item in content.links"
          :key="item.href"
          :href="item.href"
          class="whitespace-nowrap text-sm font-semibold text-gray-700 transition hover:text-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100"
          @click="closeAllMenus"
        >
          {{ item.label }}
        </a>
      </div>

      <a
        class="btn-fill-outline inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-primary-700 px-3 text-sm font-semibold text-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100 sm:hidden"
        :href="footer.phoneHref"
      >
        <PhoneIcon class="h-4 w-4" aria-hidden="true" />
        Contact
      </a>

      <div class="hidden shrink-0 items-center gap-3 sm:flex">
        <a
          class="hidden font-sans text-center leading-tight tracking-tight xl:block"
          :href="footer.phoneHref"
        >
          <span class="block text-sm font-bold text-primary-700">À votre écoute !</span>
          <span class="block text-base font-bold text-gray-800">{{ footer.phone }}</span>
        </a>
        <a
          class="btn-fill-outline hidden h-9 items-center justify-center gap-2 rounded-lg border border-primary-700 px-4 text-sm font-semibold text-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100 md:inline-flex"
          :href="footer.phoneHref"
        >
          <PhoneIcon class="h-4 w-4" aria-hidden="true" />
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

    <Transition name="mega-menu">
      <div
        v-if="megaMenu && desktopMegaMenuOpen"
        class="absolute left-0 right-0 top-full hidden pt-3 lg:block"
        @mouseenter="openMegaMenuNow"
        @mouseleave="scheduleMegaMenuClose"
      >
        <MarketingMegaMenu :menu="megaMenu" @select="closeAllMenus" />
      </div>
    </Transition>

    <Transition name="mobile-menu">
      <div
        v-if="mobileMenuOpen"
        id="mobile-navigation"
        class="absolute left-0 right-0 top-full max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-gray-100 bg-white px-4 pb-5 pt-2 shadow-lg shadow-gray-900/5 lg:hidden"
      >
        <div class="mx-auto flex max-w-[86rem] flex-col gap-2">
          <div v-if="megaMenu" class="rounded-xl border border-gray-100">
            <button
              type="button"
              class="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold text-gray-800 focus:outline-none focus:ring-4 focus:ring-primary-100"
              :aria-expanded="mobileProductOpen"
              aria-controls="mobile-product-navigation"
              @click="mobileProductOpen = !mobileProductOpen"
            >
              {{ megaMenu.label }}
              <ChevronDownIcon
                class="h-4 w-4 transition"
                :class="{ 'rotate-180 text-primary-700': mobileProductOpen }"
                aria-hidden="true"
              />
            </button>

            <div
              v-if="mobileProductOpen"
              id="mobile-product-navigation"
              class="border-t border-gray-100 px-2 pb-2 pt-3"
            >
              <div
                v-for="group in megaMenu.groups"
                :key="group.title"
                class="mb-4 last:mb-0"
              >
                <p
                  class="px-2 text-xs font-bold uppercase tracking-wide text-gray-500"
                >
                  {{ group.title }}
                </p>
                <a
                  v-for="item in group.items"
                  :key="item.id"
                  :href="item.href"
                  class="mt-1 block rounded-lg px-2 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100"
                  @click="closeAllMenus"
                >
                  {{ item.label }}
                </a>
              </div>
            </div>
          </div>

          <a
            v-else
            href="#solution"
            class="rounded-lg px-3 py-3 text-sm font-semibold text-gray-700 transition hover:bg-primary-50 hover:text-primary-700"
            @click="closeAllMenus"
          >
            Produit
          </a>

          <a
            v-for="item in content.links"
            :key="item.href"
            :href="item.href"
            class="rounded-lg px-3 py-3 text-sm font-semibold text-gray-700 transition hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100"
            @click="closeAllMenus"
          >
            {{ item.label }}
          </a>

          <div class="mt-2 grid grid-cols-1 gap-3 border-t border-gray-100 pt-4">
            <a
              class="btn-fill-outline inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-primary-700 px-4 text-sm font-semibold text-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100"
              :href="footer.phoneHref"
              @click="closeAllMenus"
            >
              <PhoneIcon class="h-4 w-4" aria-hidden="true" />
              {{ content.secondaryCta }}
            </a>
            <button
              type="button"
              class="btn-fill-primary h-11 rounded-lg bg-primary-700 px-4 text-sm font-semibold text-white shadow-sm"
              @click="selectMobile('demo')"
            >
              {{ content.primaryCta }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";
import { PhoneIcon } from "@heroicons/vue/24/outline";
import { normalizeMegaMenu } from "~/utils/marketing-navigation.mjs";

const props = defineProps({
  content: {
    type: Object,
    required: true,
  },
  footer: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["select", "login"]);
const headerRef = ref(null);
const mobileMenuOpen = ref(false);
const mobileProductOpen = ref(false);
const desktopMegaMenuOpen = ref(false);
const megaMenu = computed(() => normalizeMegaMenu(props.content.megaMenu));

let openTimer;
let closeTimer;

function clearTimers() {
  window.clearTimeout(openTimer);
  window.clearTimeout(closeTimer);
}

function openMegaMenuNow() {
  clearTimers();
  desktopMegaMenuOpen.value = true;
}

function scheduleMegaMenuOpen() {
  window.clearTimeout(closeTimer);
  openTimer = window.setTimeout(openMegaMenuNow, 120);
}

function scheduleMegaMenuClose() {
  window.clearTimeout(openTimer);
  closeTimer = window.setTimeout(() => {
    desktopMegaMenuOpen.value = false;
  }, 220);
}

function toggleMegaMenu() {
  clearTimers();
  desktopMegaMenuOpen.value = !desktopMegaMenuOpen.value;
}

function closeMegaMenu() {
  clearTimers();
  desktopMegaMenuOpen.value = false;
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  if (!mobileMenuOpen.value) mobileProductOpen.value = false;
}

function closeMobileMenu() {
  mobileMenuOpen.value = false;
  mobileProductOpen.value = false;
}

function closeAllMenus() {
  closeMegaMenu();
  closeMobileMenu();
}

function selectMobile(intent) {
  closeAllMenus();
  emit("select", intent);
}

function onDocumentPointerDown(event) {
  if (desktopMegaMenuOpen.value && !headerRef.value?.contains(event.target)) {
    closeMegaMenu();
  }
}

function onDocumentKeydown(event) {
  if (event.key === "Escape") closeAllMenus();
}

onMounted(() => {
  document.addEventListener("pointerdown", onDocumentPointerDown);
  document.addEventListener("keydown", onDocumentKeydown);
});

onBeforeUnmount(() => {
  clearTimers();
  document.removeEventListener("pointerdown", onDocumentPointerDown);
  document.removeEventListener("keydown", onDocumentKeydown);
});
</script>

<style scoped>
.mega-menu-enter-active,
.mega-menu-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.mega-menu-enter-from,
.mega-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition:
    opacity 220ms ease,
    transform 220ms ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (prefers-reduced-motion: reduce) {
  .mega-menu-enter-active,
  .mega-menu-leave-active,
  .mobile-menu-enter-active,
  .mobile-menu-leave-active {
    transition: none;
  }

  .mega-menu-enter-from,
  .mega-menu-leave-to,
  .mobile-menu-enter-from,
  .mobile-menu-leave-to {
    transform: none;
  }
}
</style>
