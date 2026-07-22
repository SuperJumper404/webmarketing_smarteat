# SmartEat Mega Menu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat SmartEat product navigation with an accessible, content-driven desktop mega menu and an equivalent mobile accordion that exposes all six current capabilities.

**Architecture:** Keep `MarketingHeader.vue` responsible for navigation state, pointer timers, global dismissal and the mobile accordion. Add a presentational `MarketingMegaMenu.vue` for the desktop panel, normalize optional mega-menu data through a small pure utility, and store labels, destinations and descriptions in `content/smarteat.fr.json`. Stable section IDs make the current anchor links work while preserving the ability to replace them with dedicated routes later.

**Tech Stack:** Nuxt 3, Vue 3 Composition API, Tailwind CSS, Heroicons Vue, Node.js `node:test`, existing JSON content validator.

**Implementation Status:** Completed and verified on 2026-07-22. Browser verification led to three targeted refinements: ESM utility exports for Nuxt, larger feature anchor offsets for the sticky header, and an absolutely positioned mobile panel so closing it cannot shift anchor destinations.

## Global Constraints

- Preserve SmartEat's white, neutral gray and violet `#7e22ce` identity.
- Keep the existing sticky translucent header, phone block, outlined contact CTA and primary demo CTA.
- Do not add a UI dependency or create product pages.
- Keep all visible marketing copy in French and save touched text as clean UTF-8.
- Desktop hover opens after 120 ms and closes after 220 ms; click, outside click, Escape and destination selection also control dismissal.
- Mobile navigation must never depend on hover and must close both menu levels after destination selection.
- Missing or invalid mega-menu data must fall back to a flat `Produit` link to `#solution`.
- Do not change the lead flow, footer, body-section order or existing card styling and motion.
- Validate at 1440 px, 1024 px and 390 px, including keyboard navigation, reduced motion and horizontal overflow.

---

## File Map

- `utils/marketing-navigation.mjs`: pure ESM normalization boundary for optional mega-menu content.
- `utils/marketing-navigation.test.js`: Node tests for valid normalization, empty-group filtering and fallback behavior.
- `content/smarteat.fr.json`: direct navigation rows, mega-menu groups, spotlight, roadmap copy and stable feature IDs.
- `scripts/validate-content.js`: schema, uniqueness and local-anchor validation.
- `components/MarketingMegaMenu.vue`: stateless desktop panel renderer and icon mapping.
- `components/MarketingHeader.vue`: desktop/mobile interaction state, timers, listeners, layout and fallback.
- `components/FeaturesSection.vue`: applies configured feature IDs to rendered articles.
- `components/ProblemSection.vue`: exposes `#pourquoi-smarteat`.
- `components/RoadmapSection.vue`: exposes `#roadmap`.

---

### Task 1: Normalize and validate the navigation model

**Files:**
- Create: `utils/marketing-navigation.mjs`
- Create: `utils/marketing-navigation.test.js`
- Modify: `scripts/validate-content.js`

**Interfaces:**
- Consumes: the optional `navigation.megaMenu` JSON object.
- Produces: `normalizeMegaMenu(menu)` returning a normalized menu object or `null`; the header will consume this exact function in Task 3.

- [ ] **Step 1: Write failing unit tests for valid, partial and absent menu data**

Create `utils/marketing-navigation.test.js`:

```js
const test = require("node:test");
const assert = require("node:assert/strict");

let normalizeMegaMenu;

test.before(async () => {
  const navigation = await import("./marketing-navigation.mjs");
  normalizeMegaMenu = navigation.normalizeMegaMenu;
});

const validMenu = {
  label: "Produit",
  fallbackHref: "#solution",
  eyebrow: "Explorer SmartEat",
  title: "Tout ce qu’il faut pour vendre, servir et piloter",
  groups: [
    {
      title: "Commander et vendre",
      items: [
        {
          id: "menu-qr",
          label: "Menu QR personnalisable",
          description: "Un menu digital à l’image du restaurant.",
          href: "#menu-qr",
          icon: "qr",
        },
      ],
    },
  ],
  spotlight: {
    title: "Découvrir SmartEat",
    text: "Découvrez la plateforme tout-en-un.",
    label: "Voir la solution",
    href: "#solution",
  },
  roadmap: {
    eyebrow: "Bientôt dans SmartEat",
    text: "Stocks, réservations, SMS marketing et paiements mobiles.",
    label: "Voir la roadmap",
    href: "#roadmap",
  },
};

test("normalizeMegaMenu preserves a complete valid menu", () => {
  assert.deepEqual(normalizeMegaMenu(validMenu), validMenu);
});

test("normalizeMegaMenu removes empty groups", () => {
  const menu = {
    ...validMenu,
    groups: [...validMenu.groups, { title: "Vide", items: [] }],
  };

  assert.deepEqual(normalizeMegaMenu(menu).groups, validMenu.groups);
});

test("normalizeMegaMenu returns null when required product navigation is absent", () => {
  assert.equal(normalizeMegaMenu(), null);
  assert.equal(normalizeMegaMenu({ ...validMenu, label: "" }), null);
  assert.equal(normalizeMegaMenu({ ...validMenu, groups: [] }), null);
});
```

- [ ] **Step 2: Run the focused tests and confirm the missing module failure**

Run: `node --test utils/marketing-navigation.test.js`

Expected: FAIL with `Cannot find module './marketing-navigation.mjs'`.

- [ ] **Step 3: Implement the minimal pure normalizer**

Create `utils/marketing-navigation.mjs`:

```js
function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function normalizeMegaMenu(menu) {
  if (!menu || typeof menu !== "object" || Array.isArray(menu)) return null;
  if (!isNonEmptyString(menu.label) || !isNonEmptyString(menu.fallbackHref)) return null;
  if (!Array.isArray(menu.groups)) return null;

  const groups = menu.groups.filter(
    (group) =>
      group &&
      typeof group === "object" &&
      isNonEmptyString(group.title) &&
      Array.isArray(group.items) &&
      group.items.length > 0,
  );

  if (groups.length === 0) return null;
  return { ...menu, groups };
}
```

- [ ] **Step 4: Run the focused tests and confirm they pass**

Run: `node --test utils/marketing-navigation.test.js`

Expected: 3 tests pass, 0 fail.

- [ ] **Step 5: Add strict mega-menu and anchor validation**

In `scripts/validate-content.js`, add beside `assertObject`:

```js
function assertNonEmptyString(value, name) {
  assert.equal(typeof value, "string", `${name} must be a string`);
  assert.ok(value.trim().length > 0, `${name} must not be empty`);
}

function assertUnique(values, name) {
  assert.equal(new Set(values).size, values.length, `${name} must be unique`);
}
```

Replace the existing navigation validation block with:

```js
assertObject(content.navigation, "navigation");
assert.ok(Array.isArray(content.navigation.links), "navigation.links must be an array");
assert.ok(content.navigation.links.length >= 3, "navigation.links must contain at least 3 links");
for (const [index, link] of content.navigation.links.entries()) {
  assertObject(link, `navigation.links[${index}]`);
  assertNonEmptyString(link.label, `navigation.links[${index}].label`);
  assertNonEmptyString(link.href, `navigation.links[${index}].href`);
}

assertObject(content.navigation.megaMenu, "navigation.megaMenu");
const megaMenu = content.navigation.megaMenu;
for (const key of ["label", "fallbackHref", "eyebrow", "title"]) {
  assertNonEmptyString(megaMenu[key], `navigation.megaMenu.${key}`);
}
assert.ok(Array.isArray(megaMenu.groups), "navigation.megaMenu.groups must be an array");
assert.equal(megaMenu.groups.length, 2, "navigation.megaMenu.groups must contain exactly 2 groups");

const capabilityIds = [];
const megaMenuHrefs = [megaMenu.fallbackHref];
for (const [groupIndex, group] of megaMenu.groups.entries()) {
  assertObject(group, `navigation.megaMenu.groups[${groupIndex}]`);
  assertNonEmptyString(group.title, `navigation.megaMenu.groups[${groupIndex}].title`);
  assert.ok(Array.isArray(group.items), `navigation.megaMenu.groups[${groupIndex}].items must be an array`);
  assert.equal(group.items.length, 3, `navigation.megaMenu.groups[${groupIndex}].items must contain 3 items`);

  for (const [itemIndex, item] of group.items.entries()) {
    const itemName = `navigation.megaMenu.groups[${groupIndex}].items[${itemIndex}]`;
    assertObject(item, itemName);
    for (const key of ["id", "label", "description", "href", "icon"]) {
      assertNonEmptyString(item[key], `${itemName}.${key}`);
    }
    capabilityIds.push(item.id);
    megaMenuHrefs.push(item.href);
  }
}

for (const blockName of ["spotlight", "roadmap"]) {
  const block = megaMenu[blockName];
  assertObject(block, `navigation.megaMenu.${blockName}`);
  for (const key of blockName === "spotlight"
    ? ["title", "text", "label", "href"]
    : ["eyebrow", "text", "label", "href"]) {
    assertNonEmptyString(block[key], `navigation.megaMenu.${blockName}.${key}`);
  }
  megaMenuHrefs.push(block.href);
}

assertUnique(capabilityIds, "mega-menu capability IDs");
assertUnique(megaMenu.groups.flatMap((group) => group.items.map((item) => item.href)), "mega-menu capability hrefs");
assert.equal(typeof content.navigation.primaryCta, "string", "navigation.primaryCta must be a string");
assert.equal(typeof content.navigation.secondaryCta, "string", "navigation.secondaryCta must be a string");
```

Extend the feature validation loop with `assertNonEmptyString(feature.id, ...)`, then add after the loop:

```js
const featureIds = content.features.map((feature) => feature.id);
assertUnique(featureIds, "feature IDs");
assert.deepEqual(featureIds, capabilityIds, "feature IDs must match mega-menu capability IDs and order");

const knownLocalAnchors = new Set([
  "#pourquoi-smarteat",
  "#solution",
  "#contact",
  "#faq",
  "#roadmap",
  ...featureIds.map((id) => `#${id}`),
]);
const localNavigationHrefs = [
  ...content.navigation.links.map((link) => link.href),
  ...megaMenuHrefs,
].filter((href) => href.startsWith("#"));
for (const href of localNavigationHrefs) {
  assert.ok(knownLocalAnchors.has(href), `Unknown local navigation anchor: ${href}`);
}
```

- [ ] **Step 6: Run content validation and confirm the old JSON fails against the new schema**

Run: `npm run test:content`

Expected: FAIL with `navigation.megaMenu must be an object`.

- [ ] **Step 7: Commit the model and failing schema boundary**

```bash
git add utils/marketing-navigation.mjs utils/marketing-navigation.test.js scripts/validate-content.js
git commit -m "test: define SmartEat mega menu model"
```

---

### Task 2: Add content data and stable page anchors

**Files:**
- Modify: `content/smarteat.fr.json`
- Modify: `components/FeaturesSection.vue`
- Modify: `components/ProblemSection.vue`
- Modify: `components/RoadmapSection.vue`

**Interfaces:**
- Consumes: the schema defined in Task 1.
- Produces: `navigation.megaMenu`, exactly six feature IDs, `#pourquoi-smarteat`, six capability anchors and `#roadmap`.

- [ ] **Step 1: Replace the navigation JSON with direct rows and the approved mega-menu data**

Use this exact `navigation` object in `content/smarteat.fr.json`:

```json
"navigation": {
  "logoAlt": "SmartEat",
  "links": [
    { "label": "Pourquoi SmartEat", "href": "#pourquoi-smarteat" },
    { "label": "Comment ça marche", "href": "#contact" },
    { "label": "FAQ", "href": "#faq" }
  ],
  "megaMenu": {
    "label": "Produit",
    "fallbackHref": "#solution",
    "eyebrow": "Explorer SmartEat",
    "title": "Tout ce qu’il faut pour vendre, servir et piloter",
    "groups": [
      {
        "title": "Commander et vendre",
        "items": [
          {
            "id": "menu-qr",
            "label": "Menu QR personnalisable",
            "description": "Un menu digital à l’image du restaurant.",
            "href": "#menu-qr",
            "icon": "qr"
          },
          {
            "id": "prise-de-commande",
            "label": "Prise de commande",
            "description": "Centraliser les commandes et réduire les erreurs.",
            "href": "#prise-de-commande",
            "icon": "orders"
          },
          {
            "id": "click-and-collect",
            "label": "Click & Collect",
            "description": "Vendre aussi en dehors du service en salle.",
            "href": "#click-and-collect",
            "icon": "collect"
          }
        ]
      },
      {
        "title": "Gérer et piloter",
        "items": [
          {
            "id": "tableau-de-bord",
            "label": "Tableau de bord",
            "description": "Suivre les ventes et les tendances.",
            "href": "#tableau-de-bord",
            "icon": "dashboard"
          },
          {
            "id": "plan-de-table",
            "label": "Plan de table et QR codes",
            "description": "Organiser les tables et le parcours client.",
            "href": "#plan-de-table",
            "icon": "tables"
          },
          {
            "id": "journal-des-ventes",
            "label": "Journal des ventes",
            "description": "Conserver une activité claire et structurée.",
            "href": "#journal-des-ventes",
            "icon": "journal"
          }
        ]
      }
    ],
    "spotlight": {
      "title": "Découvrir SmartEat",
      "text": "Retrouvez la plateforme tout-en-un pensée pour simplifier le service et le pilotage.",
      "label": "Voir la solution",
      "href": "#solution"
    },
    "roadmap": {
      "eyebrow": "Bientôt dans SmartEat",
      "text": "Stocks, réservations, SMS marketing et paiements mobiles.",
      "label": "Voir la roadmap",
      "href": "#roadmap"
    }
  },
  "primaryCta": "Demander une démo",
  "secondaryCta": "Nous contacter"
}
```

- [ ] **Step 2: Add the six exact IDs to the existing feature objects**

Add the `id` field as the first property of each feature object, in this order:

```json
"id": "menu-qr"
"id": "prise-de-commande"
"id": "click-and-collect"
"id": "tableau-de-bord"
"id": "plan-de-table"
"id": "journal-des-ventes"
```

- [ ] **Step 3: Render the configured feature anchor without changing card styling**

In `components/FeaturesSection.vue`, add only `:id="feature.id"` to the existing `<article>`:

```vue
<article
  v-for="(feature, index) in items"
  :id="feature.id"
  :key="feature.title"
  class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition duration-300 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-900/10"
  v-motion="featureMotion(index)"
>
```

- [ ] **Step 4: Expose the approved problem and roadmap anchors**

Change the opening tags only:

```vue
<!-- components/ProblemSection.vue -->
<section id="pourquoi-smarteat" class="scroll-mt-24 bg-white">

<!-- components/RoadmapSection.vue -->
<section id="roadmap" class="scroll-mt-24 bg-gray-50">
```

If the roadmap currently uses a different background class, retain that class and add only `id="roadmap"` plus `scroll-mt-24`.

- [ ] **Step 5: Run content validation and all utility tests**

Run: `npm run test:content && node --test utils/marketing-navigation.test.js`

Expected: both commands pass; content output ends with `SmartEat content JSON OK`.

- [ ] **Step 6: Commit content and anchors**

```bash
git add content/smarteat.fr.json components/FeaturesSection.vue components/ProblemSection.vue components/RoadmapSection.vue
git commit -m "feat: add SmartEat product navigation content"
```

---

### Task 3: Build the presentational desktop mega menu

**Files:**
- Create: `components/MarketingMegaMenu.vue`

**Interfaces:**
- Consumes: required prop `menu: Object` with `groups`, `spotlight` and `roadmap` from Task 2.
- Produces: `select` event whenever any destination is chosen; no timers, listeners or open state.

- [ ] **Step 1: Create the stateless panel with static Heroicon mapping**

Create `components/MarketingMegaMenu.vue` with this complete implementation:

```vue
<template>
  <div
    id="product-mega-menu"
    class="mx-auto w-full max-w-[86rem] px-4 sm:px-6 lg:px-8"
    @click="$emit('select')"
  >
    <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-950/10">
      <div class="grid gap-8 p-7 lg:grid-cols-[1fr_1fr_0.85fr] lg:p-8">
        <div class="lg:col-span-2">
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-primary-700">
            {{ menu.eyebrow }}
          </p>
          <h2 class="mt-2 text-2xl font-bold tracking-tight text-gray-950">
            {{ menu.title }}
          </h2>

          <div class="mt-6 grid gap-6 sm:grid-cols-2">
            <div v-for="group in menu.groups" :key="group.title">
              <p class="mb-2 text-sm font-bold text-gray-950">{{ group.title }}</p>
              <div class="space-y-1">
                <a
                  v-for="item in group.items"
                  :key="item.id"
                  :href="item.href"
                  class="group flex gap-3 rounded-xl p-3 transition duration-200 hover:bg-primary-50 focus:outline-none focus:ring-4 focus:ring-primary-100"
                >
                  <span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition group-hover:bg-white group-hover:text-primary-700">
                    <component :is="iconFor(item.icon)" class="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span class="block text-sm font-bold text-gray-950 transition group-hover:text-primary-700">
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
          <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-primary-700 shadow-sm">
            <SparklesIcon class="h-6 w-6" aria-hidden="true" />
          </span>
          <span>
            <span class="block text-xl font-bold">{{ menu.spotlight.title }}</span>
            <span class="mt-2 block text-sm leading-6 text-gray-600">{{ menu.spotlight.text }}</span>
            <span class="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary-700">
              {{ menu.spotlight.label }}
              <ArrowRightIcon class="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </span>
        </a>
      </div>

      <a
        :href="menu.roadmap.href"
        class="group flex items-center justify-between gap-6 border-t border-gray-100 bg-gray-50 px-7 py-4 transition hover:bg-primary-50 focus:outline-none focus:ring-4 focus:ring-inset focus:ring-primary-100 lg:px-8"
      >
        <span>
          <span class="block text-xs font-bold uppercase tracking-[0.16em] text-primary-700">
            {{ menu.roadmap.eyebrow }}
          </span>
          <span class="mt-1 block text-sm text-gray-600">{{ menu.roadmap.text }}</span>
        </span>
        <span class="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-gray-950 group-hover:text-primary-700">
          {{ menu.roadmap.label }}
          <ArrowRightIcon class="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
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
```

- [ ] **Step 2: Run a production build to catch Vue, import and Tailwind errors**

Run: `npm run build`

Expected: Nuxt build exits 0; no unresolved Heroicon export or Vue template error.

- [ ] **Step 3: Commit the presentational component**

```bash
git add components/MarketingMegaMenu.vue
git commit -m "feat: add SmartEat mega menu panel"
```

---

### Task 4: Integrate desktop behavior and the mobile product accordion

**Files:**
- Modify: `components/MarketingHeader.vue`

**Interfaces:**
- Consumes: `normalizeMegaMenu(content.megaMenu)` and `MarketingMegaMenu`'s `select` event.
- Produces: accessible desktop trigger/panel behavior, mobile accordion behavior and flat fallback navigation.

- [ ] **Step 1: Add state, timers and lifecycle cleanup**

Replace the current `<script setup>` in `components/MarketingHeader.vue` with:

```vue
<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";
import { normalizeMegaMenu } from "~/utils/marketing-navigation.mjs";

const props = defineProps({
  content: { type: Object, required: true },
  footer: { type: Object, required: true },
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
  if (desktopMegaMenuOpen.value && !headerRef.value?.contains(event.target)) closeMegaMenu();
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
```

- [ ] **Step 2: Add the desktop trigger, fallback and direct links**

Add `ref="headerRef"` to the root `<header>`. Replace the current desktop `content.links` block with:

```vue
<div class="hidden items-center gap-7 md:flex">
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
    class="text-sm font-semibold text-gray-700 transition hover:text-primary-700"
  >
    Produit
  </a>
  <a
    v-for="item in content.links"
    :key="item.href"
    :href="item.href"
    class="text-sm font-semibold text-gray-700 transition hover:text-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100"
    @click="closeAllMenus"
  >
    {{ item.label }}
  </a>
</div>
```

- [ ] **Step 3: Render the animated desktop panel beneath the nav**

Insert immediately after `</nav>` and before the mobile transition:

```vue
<Transition name="mega-menu">
  <div
    v-if="megaMenu && desktopMegaMenuOpen"
    class="absolute left-0 right-0 top-full hidden pt-3 md:block"
    @mouseenter="openMegaMenuNow"
    @mouseleave="scheduleMegaMenuClose"
  >
    <MarketingMegaMenu :menu="megaMenu" @select="closeAllMenus" />
  </div>
</Transition>
```

The sticky root header already establishes the positioning context; add the following to the scoped style:

```css
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
```

- [ ] **Step 4: Replace the mobile flat product row with an accordion and keep direct links**

Inside `#mobile-navigation`, before the direct `content.links` loop, add:

```vue
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
  <div v-if="mobileProductOpen" id="mobile-product-navigation" class="border-t border-gray-100 px-2 pb-2 pt-3">
    <div v-for="group in megaMenu.groups" :key="group.title" class="mb-4 last:mb-0">
      <p class="px-2 text-xs font-bold uppercase tracking-wide text-gray-500">{{ group.title }}</p>
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
```

Keep the following `v-for="item in content.links"` direct rows and change their click handler to `@click="closeAllMenus"`.

- [ ] **Step 5: Run the complete automated suite and build**

Run: `npm test`

Expected: lead, content and motion suites all pass.

Run: `npm run build`

Expected: Nuxt production build exits 0 with no Vue template, import or SSR error.

- [ ] **Step 6: Commit the integrated navigation**

```bash
git add components/MarketingHeader.vue
git commit -m "feat: integrate accessible SmartEat mega menu"
```

---

### Task 5: Verify the real page and polish only observed defects

**Files:**
- Modify if required by observed defects: `components/MarketingHeader.vue`
- Modify if required by observed defects: `components/MarketingMegaMenu.vue`

**Interfaces:**
- Consumes: the completed navigation from Tasks 1–4.
- Produces: evidence that desktop, keyboard, mobile and reduced-motion behavior satisfy the approved acceptance criteria.

- [ ] **Step 1: Start or reuse the local Nuxt development server**

Run: `npm run dev`

Expected: Nuxt reports a local URL and the landing page loads without console exceptions.

- [ ] **Step 2: Verify desktop pointer and click behavior at 1440 px and 1024 px**

Check all of the following in the browser:

```text
Produit opens after the short hover delay.
Crossing from trigger to panel does not flicker.
Leaving both trigger and panel closes after the longer delay.
Click toggles the panel.
Outside click and Escape close it.
All six capability links land on the matching feature cards.
Pourquoi SmartEat, Comment ça marche, FAQ, contact and demo remain available.
The panel stays within the viewport and causes no horizontal scrollbar.
```

- [ ] **Step 3: Verify keyboard access**

Check this exact sequence:

```text
Tab reaches Produit with a visible focus state.
Enter and Space open or close Produit through native button behavior.
Tab proceeds through every mega-menu destination in visual order.
Focus is not trapped.
Escape closes both desktop and mobile navigation states.
```

- [ ] **Step 4: Verify mobile behavior at 390 px**

Check all of the following:

```text
The main mobile navigation opens from the existing header control.
Produit expands and collapses as an accordion without hover.
Both functional groups and all six capabilities are visible.
Selecting a capability closes the accordion and the main menu.
Direct navigation, phone/contact and demo actions remain stacked and usable.
There is no horizontal overflow.
```

- [ ] **Step 5: Verify reduced motion**

Enable `prefers-reduced-motion: reduce` in browser rendering settings and confirm the mega menu appears and disappears without translation or delayed animation.

- [ ] **Step 6: Apply only fixes demonstrated by the checks, then rerun verification**

For any observed issue, first reproduce it, make the smallest edit in `MarketingHeader.vue` or `MarketingMegaMenu.vue`, repeat the failed browser interaction, then rerun:

```bash
npm test
npm run build
```

Expected: all tests pass and the production build exits 0.

- [ ] **Step 7: Commit verified polish if code changed**

```bash
git add components/MarketingHeader.vue components/MarketingMegaMenu.vue
git commit -m "fix: polish SmartEat mega menu interactions"
```

Skip this commit when browser verification required no code changes.
