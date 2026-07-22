# SmartEat Omnichannel Solution Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the text-only SmartEat solution section with three image-led omnichannel cards and a synchronization band showing that kiosk, counter/table and QR-mobile orders share one system.

**Architecture:** Keep the section content-driven through `content/smarteat.fr.json`, with `SolutionSection.vue` rendering exactly three cards and one shared synchronization band. Prepare the three supplied product images as true transparent PNG assets before using them, extend the existing content validator for the new schema and anchor targets, and add a focused source-contract validator because the project has no Vue component test runner.

**Tech Stack:** Nuxt 3, Vue 3 Composition API, Tailwind CSS, Heroicons Vue, Node.js assertions, existing SmartEat content and motion validators, image editing through the `imagegen` skill.

## Global Constraints

- Preserve SmartEat's white, soft neutral gray and violet `#7e22ce` identity.
- Use exactly three cards: kiosk, table/counter and phone QR, in that order.
- Use the three user-supplied images and remove only their baked checkerboard backgrounds.
- Preserve device proportions, SmartEat logos, product-screen contents and soft product shadows.
- Do not add a fourth card, product page, UI dependency or unrelated landing-page change.
- Cards remain white and never switch to a black surface or purple neon treatment.
- Desktop uses three equal columns; tablet uses two columns with a centered single-width third card; mobile stacks all cards.
- Hover translates a card upward by 8 px and scales its image to `1.025`; reduced-motion users receive neither transform.
- Validate at 1440 px, 1024 px and 390 px with no horizontal overflow.
- Preserve all existing uncommitted user changes outside the files listed in this plan.

---

## File Map

- `public/solution-borne.png`: transparent kiosk product image.
- `public/solution-comptoir.png`: transparent counter/table terminal product image.
- `public/solution-qr-mobile.png`: transparent phone and table QR product image.
- `content/smarteat.fr.json`: approved section title, three cards, CTA destinations and synchronization-band content.
- `scripts/validate-content.js`: exact solution schema, IDs, image paths, synchronization labels and known-anchor validation.
- `scripts/validate-solution-section.js`: focused template contract for semantic cards, responsive layout, sync band and motion reduction.
- `package.json`: exposes `test:solution` and includes it in the existing test chain.
- `components/SolutionSection.vue`: complete responsive card grid and synchronization band.

---

### Task 1: Prepare the three transparent product assets

**Files:**
- Source: `C:/Users/kalag/Pictures/Smarteat/ChatGPT Image 21 juil. 2026, 22_57_44.png`
- Source: `C:/Users/kalag/Pictures/Smarteat/ChatGPT Image 21 juil. 2026, 22_48_59.png`
- Source: `C:/Users/kalag/Downloads/ChatGPT Image 22 juil. 2026, 13_30_50.png`
- Create: `public/solution-borne.png`
- Create: `public/solution-comptoir.png`
- Create: `public/solution-qr-mobile.png`

**Interfaces:**
- Consumes: three opaque 24-bit RGB PNGs with checkerboards baked into their pixels.
- Produces: three true-alpha PNGs at the exact public paths consumed by Task 2 and Task 3.

- [ ] **Step 1: Read and follow the `imagegen` skill before editing**

Use the image editing tool with one source image per call. Do not combine the three products into one output.

- [ ] **Step 2: Remove the kiosk checkerboard**

Use this exact image-editing prompt with the kiosk source:

```text
Edit this existing SmartEat kiosk product image. Remove only the light gray and white checkerboard background and make every background pixel truly transparent. Preserve the white kiosk hardware, its exact proportions, SmartEat logos, the complete menu interface on the screen, all existing text and product imagery, and the subtle natural shadow around the device. Do not redesign, regenerate, crop, recolor, relight, add text, or change the screen. Return a high-resolution PNG with a real alpha channel and the entire kiosk visible.
```

Save the result as `public/solution-borne.png`.

- [ ] **Step 3: Remove the counter terminal checkerboard**

Use this exact image-editing prompt with the terminal source:

```text
Edit this existing SmartEat counter terminal product image. Remove only the light gray and white checkerboard background and make every background pixel truly transparent. Preserve the black and white terminal hardware, its exact proportions, SmartEat logo, the complete ordering interface on the screen, all existing text and product imagery, and the subtle natural shadow around the device. Do not redesign, regenerate, crop, recolor, relight, add text, or change the screen. Return a high-resolution PNG with a real alpha channel and the entire terminal visible.
```

Save the result as `public/solution-comptoir.png`.

- [ ] **Step 4: Remove the QR-mobile checkerboard**

Use this exact image-editing prompt with the phone/QR source:

```text
Edit this existing SmartEat phone and table QR product image. Remove only the light gray and white checkerboard background and make every background pixel truly transparent. Preserve the complete phone, table QR card, exact proportions, SmartEat branding, menu interface, existing text and product imagery, and subtle natural shadows. Do not redesign, regenerate, crop, recolor, relight, add text, or change the phone screen or QR card. Return a high-resolution PNG with a real alpha channel and both objects fully visible.
```

Save the result as `public/solution-qr-mobile.png`.

- [ ] **Step 5: Verify dimensions and real alpha transparency**

Run this PowerShell command from `web_marketing_qr_menu`:

```powershell
Add-Type -AssemblyName System.Drawing
$paths = @(
  "public\solution-borne.png",
  "public\solution-comptoir.png",
  "public\solution-qr-mobile.png"
)
foreach ($path in $paths) {
  $image = [System.Drawing.Bitmap]::FromFile((Resolve-Path $path))
  $alphaSamples = @(
    $image.GetPixel(0, 0).A,
    $image.GetPixel($image.Width - 1, 0).A,
    $image.GetPixel(0, $image.Height - 1).A,
    $image.GetPixel($image.Width - 1, $image.Height - 1).A
  )
  [pscustomobject]@{
    Name = [IO.Path]::GetFileName($path)
    Width = $image.Width
    Height = $image.Height
    PixelFormat = $image.PixelFormat
    CornerAlpha = $alphaSamples -join ","
  }
  $image.Dispose()
}
```

Expected: every file exists, `PixelFormat` contains `Argb`, and at least one corner alpha sample is `0` for every image.

- [ ] **Step 6: Inspect every output at original resolution**

Open each PNG with the local image viewer and confirm:

```text
The complete device is visible.
The checkerboard is absent.
White hardware edges remain intact.
SmartEat branding and screen contents are unchanged.
No new text, object or colored background was introduced.
```

- [ ] **Step 7: Commit the approved transparent assets**

```bash
git add public/solution-borne.png public/solution-comptoir.png public/solution-qr-mobile.png
git commit -m "assets: add SmartEat omnichannel product visuals"
```

---

### Task 2: Define and validate the section content schema

**Files:**
- Modify: `scripts/validate-content.js`
- Modify: `content/smarteat.fr.json`

**Interfaces:**
- Consumes: the three public image paths from Task 1 and existing feature anchors.
- Produces: `solution.cards: Array<SolutionCard>` with exactly three objects and `solution.sync: SolutionSync`, consumed verbatim by Task 3.

- [ ] **Step 1: Write the failing solution-schema assertions**

Immediately after the current `solution.text` assertion in `scripts/validate-content.js`, add:

```js
assert.ok(Array.isArray(content.solution.cards), "solution.cards must be an array");
assert.equal(content.solution.cards.length, 3, "solution.cards must contain exactly 3 cards");

const solutionCardIds = [];
const solutionCardHrefs = [];
for (const [index, card] of content.solution.cards.entries()) {
  const cardName = `solution.cards[${index}]`;
  assertObject(card, cardName);
  for (const key of ["id", "title", "text", "image", "imageAlt", "ctaLabel", "href"]) {
    assertNonEmptyString(card[key], `${cardName}.${key}`);
  }
  assert.ok(card.image.startsWith("/"), `${cardName}.image must use a public absolute path`);
  solutionCardIds.push(card.id);
  solutionCardHrefs.push(card.href);
}
assertUnique(solutionCardIds, "solution card IDs");
assert.deepEqual(
  solutionCardIds,
  ["borne", "comptoir", "qr-mobile"],
  "solution card IDs must match the approved order",
);

assertObject(content.solution.sync, "solution.sync");
for (const key of ["eyebrow", "title", "text"]) {
  assertNonEmptyString(content.solution.sync[key], `solution.sync.${key}`);
}
assert.ok(Array.isArray(content.solution.sync.items), "solution.sync.items must be an array");
assert.deepEqual(
  content.solution.sync.items,
  ["Borne", "Comptoir", "QR mobile"],
  "solution.sync.items must match the approved values and order",
);
```

Extend the existing `localNavigationHrefs` array with:

```js
...solutionCardHrefs,
```

- [ ] **Step 2: Run content validation and confirm the old JSON fails**

Run: `npm.cmd run test:content`

Expected: FAIL with `solution.cards must be an array`.

- [ ] **Step 3: Replace the solution JSON with the approved content**

Use this exact object in `content/smarteat.fr.json`:

```json
"solution": {
  "eyebrow": "La solution SmartEat",
  "title": "Unifiez tous vos points de commande avec SmartEat",
  "text": "Sur borne, à table, au comptoir ou sur mobile, chaque commande rejoint le même espace.",
  "cards": [
    {
      "id": "borne",
      "title": "Borne de commande",
      "text": "Vos clients consultent le menu, commandent et paient en autonomie, même pendant les périodes de forte affluence.",
      "image": "/solution-borne.png",
      "imageAlt": "Borne de commande SmartEat affichant le menu du restaurant",
      "ctaLabel": "Voir la prise de commande",
      "href": "#prise-de-commande"
    },
    {
      "id": "comptoir",
      "title": "Sur table et au comptoir",
      "text": "Votre équipe prend, suit et centralise les commandes depuis le même terminal, en salle comme au comptoir.",
      "image": "/solution-comptoir.png",
      "imageAlt": "Terminal de comptoir SmartEat affichant les commandes et le menu",
      "ctaLabel": "Voir le pilotage",
      "href": "#tableau-de-bord"
    },
    {
      "id": "qr-mobile",
      "title": "Menu QR sur téléphone",
      "text": "Le client scanne le QR code, consulte le menu et commande directement depuis sa table avec son téléphone.",
      "image": "/solution-qr-mobile.png",
      "imageAlt": "Téléphone SmartEat avec menu digital et QR code de table",
      "ctaLabel": "Voir le menu QR",
      "href": "#menu-qr"
    }
  ],
  "sync": {
    "eyebrow": "Un seul écosystème",
    "title": "Tout communique en temps réel",
    "text": "Commandes, produits, prix, tables et disponibilités restent synchronisés dans SmartEat.",
    "items": ["Borne", "Comptoir", "QR mobile"]
  }
}
```

- [ ] **Step 4: Run content validation and confirm it passes**

Run: `npm.cmd run test:content`

Expected: exit 0 with `SmartEat content JSON OK`.

- [ ] **Step 5: Commit the content contract**

```bash
git add scripts/validate-content.js content/smarteat.fr.json
git commit -m "feat: define SmartEat omnichannel solution content"
```

---

### Task 3: Build and contract-test the responsive solution section

**Files:**
- Create: `scripts/validate-solution-section.js`
- Modify: `package.json`
- Modify: `components/SolutionSection.vue`

**Interfaces:**
- Consumes: `content.cards` and `content.sync` from Task 2.
- Produces: three semantic product cards, existing-anchor CTAs and one synchronization band.

- [ ] **Step 1: Create the failing component-contract validator**

Create `scripts/validate-solution-section.js`:

```js
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const componentPath = path.join(__dirname, "..", "components", "SolutionSection.vue");
const source = fs.readFileSync(componentPath, "utf8");

assert.match(source, /v-for="\(card, index\) in content\.cards"/, "Solution cards must be content-driven");
assert.match(source, /<article/, "Solution cards must use semantic articles");
assert.match(source, /content\.sync\.title/, "Solution section must render the synchronization band");
assert.match(source, /sm:grid-cols-2/, "Solution section must use the approved tablet grid");
assert.match(source, /lg:grid-cols-3/, "Solution section must use the approved desktop grid");
assert.match(source, /motion-reduce:transform-none/, "Solution motion must respect reduced-motion preferences");
assert.match(source, /ArrowsRightLeftIcon/, "Synchronization band must use the approved connection icon");

console.log("SmartEat solution section integration OK");
```

In `package.json`, add:

```json
"test:solution": "node scripts/validate-solution-section.js"
```

Change the existing `test` command to:

```json
"test": "npm run test:lead && npm run test:content && npm run test:motion && npm run test:solution"
```

- [ ] **Step 2: Run the focused contract and confirm the old component fails**

Run: `npm.cmd run test:solution`

Expected: FAIL with `Solution cards must be content-driven`.

- [ ] **Step 3: Replace `SolutionSection.vue` with the approved implementation**

Use this complete component:

```vue
<template>
  <section id="solution" class="scroll-mt-24 bg-gray-50">
    <div class="mx-auto max-w-[86rem] px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div class="mx-auto w-full max-w-5xl text-center" data-reveal>
        <p class="text-sm font-semibold uppercase tracking-wide text-primary-700">
          {{ content.eyebrow }}
        </p>
        <h2 class="mt-4 text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
          {{ content.title }}
        </h2>
        <p class="mx-auto mt-5 max-w-3xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
          {{ content.text }}
        </p>
      </div>

      <div class="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="(card, index) in content.cards"
          :key="card.id"
          class="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-gray-900/10 focus-within:-translate-y-2 focus-within:shadow-xl motion-reduce:transform-none motion-reduce:transition-none sm:p-5"
          :class="index === 2 ? 'sm:col-span-2 sm:mx-auto sm:w-[calc(50%-0.75rem)] lg:col-span-1 lg:w-auto' : ''"
          data-reveal
        >
          <div class="aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
            <img
              class="h-full w-full object-contain p-5 transition duration-500 group-hover:scale-[1.025] group-focus-within:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none sm:p-7"
              :src="card.image"
              :alt="card.imageAlt"
            />
          </div>

          <div class="flex flex-1 flex-col px-1 pb-1 pt-6">
            <h3 class="text-2xl font-bold leading-8 text-gray-950">
              {{ card.title }}
            </h3>
            <p class="mt-3 text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
              {{ card.text }}
            </p>
            <a
              :href="card.href"
              class="btn-fill-outline mt-7 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-primary-700 px-4 text-sm font-semibold text-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100"
            >
              {{ card.ctaLabel }}
              <ArrowRightIcon class="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </article>
      </div>

      <div class="mt-8 rounded-2xl border border-primary-100 bg-primary-50/70 p-6 sm:p-8" data-reveal>
        <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex max-w-3xl items-start gap-4">
            <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-primary-700 shadow-sm">
              <ArrowsRightLeftIcon class="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.16em] text-primary-700">
                {{ content.sync.eyebrow }}
              </p>
              <h3 class="mt-2 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                {{ content.sync.title }}
              </h3>
              <p class="mt-2 text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
                {{ content.sync.text }}
              </p>
            </div>
          </div>

          <div class="flex flex-wrap gap-2 lg:justify-end" aria-label="Points de commande synchronisés">
            <span
              v-for="item in content.sync.items"
              :key="item"
              class="rounded-full border border-primary-200 bg-white px-4 py-2 text-sm font-bold text-primary-800"
            >
              {{ item }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ArrowRightIcon, ArrowsRightLeftIcon } from "@heroicons/vue/24/outline";

defineProps({
  content: {
    type: Object,
    required: true,
  },
});
</script>
```

- [ ] **Step 4: Run the focused contract and confirm it passes**

Run: `npm.cmd run test:solution`

Expected: exit 0 with `SmartEat solution section integration OK`.

- [ ] **Step 5: Run the complete automated suite**

Run: `npm.cmd test`

Expected: lead tests pass with 0 failures; content, motion and solution validators all print their `OK` messages.

- [ ] **Step 6: Commit the implemented section**

```bash
git add scripts/validate-solution-section.js package.json components/SolutionSection.vue
git commit -m "feat: build SmartEat omnichannel solution section"
```

---

### Task 4: Build and verify the real responsive page

**Files:**
- Modify only if an observed defect requires it: `components/SolutionSection.vue`
- Modify only if an observed content defect requires it: `content/smarteat.fr.json`
- Modify only if an observed image defect requires it: `public/solution-borne.png`
- Modify only if an observed image defect requires it: `public/solution-comptoir.png`
- Modify only if an observed image defect requires it: `public/solution-qr-mobile.png`

**Interfaces:**
- Consumes: the completed assets, content and component from Tasks 1–3.
- Produces: fresh automated and browser evidence for every acceptance criterion.

- [ ] **Step 1: Run the production build**

Run: `npm.cmd run build`

Expected: Nuxt exits 0 with no Vue template, Heroicon import or asset-resolution error.

- [ ] **Step 2: Open the existing local SmartEat site at 1440 × 900**

Reload `http://127.0.0.1:3000/`, scroll to `#solution` and verify:

```text
The eyebrow, approved heading and approved paragraph are centered.
All three cards occupy one equal row.
Every device is fully visible and the checkerboard is absent.
Card heights, media panels and CTA baselines align.
The synchronization band reads as one shared system layer.
No horizontal overflow exists.
```

- [ ] **Step 3: Verify 1024 × 820**

Confirm the three-column `lg` layout fits without clipped text, cropped devices or header overlap, and that each CTA lands below the sticky header.

- [ ] **Step 4: Verify 390 × 844**

Confirm the cards stack kiosk, counter/table, phone QR; the sync labels wrap; devices remain legible; CTAs remain full-width; and `document.documentElement.scrollWidth <= window.innerWidth`.

- [ ] **Step 5: Verify keyboard and reduced-motion behavior**

Tab through all three CTAs and confirm a visible focus ring. Emulate `prefers-reduced-motion: reduce` and confirm card/image transforms and transitions are disabled.

- [ ] **Step 6: Check browser errors**

Read the browser error log and require an empty result for the SmartEat page.

- [ ] **Step 7: Apply only fixes proven necessary by browser evidence**

After every fix, repeat the failed check, then rerun:

```bash
npm.cmd test
npm.cmd run build
```

Expected: all tests and validators pass, and Nuxt exits 0.

- [ ] **Step 8: Commit verified polish only when files changed**

```bash
git add components/SolutionSection.vue content/smarteat.fr.json public/solution-borne.png public/solution-comptoir.png public/solution-qr-mobile.png
git commit -m "fix: polish SmartEat omnichannel solution section"
```

Skip this commit when browser verification requires no code or asset changes.
