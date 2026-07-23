# SmartEat Solution Card Overflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make all three SmartEat product visuals visibly extend above the top of their white cards while preserving the current responsive layout, aligned content and motion behavior.

**Architecture:** Keep the card and media panel in normal document flow, reserve vertical room at the top of the grid, and absolutely anchor each transparent product image to the bottom of a taller media box. Use larger row gaps only at breakpoints where cards wrap so an overflowing image cannot collide with the preceding card.

**Tech Stack:** Nuxt 3, Vue 3, Tailwind CSS, Node.js source-contract assertions, existing in-app browser verification.

## Global Constraints

- Modify only `SolutionSection.vue` and its focused contract test.
- Preserve the current images, copy, links, colors, synchronization band and CTA alignment.
- Target roughly 70 px of visible card overflow on tablet/desktop and 40 px on mobile.
- Keep every image fully visible with `object-contain`.
- Preserve the existing hover and `motion-reduce` behavior.
- Prevent horizontal overflow and card-to-card overlap at 1440 px, 1024 px and 390 px.

---

### Task 1: Add the tested floating-product layout

**Files:**
- Modify: `scripts/validate-solution-section.js`
- Modify: `components/SolutionSection.vue`

**Interfaces:**
- Consumes: the existing three transparent images rendered from `content.cards`.
- Produces: a grid with reserved overflow space and three media images anchored beyond the card top.

- [ ] **Step 1: Write the failing layout-contract assertions**

Add these assertions before the final `console.log` in `scripts/validate-solution-section.js`:

```js
assert.match(source, /pt-14 sm:pt-\[5\.5rem\]/, "Solution grid must reserve space for floating visuals");
assert.match(source, /gap-y-20 sm:gap-y-24 lg:gap-y-6/, "Wrapped solution cards must not overlap");
assert.match(source, /aspect-\[4\/3\][^"]*overflow-visible/, "Solution media panels must expose overflowing images");
assert.match(source, /absolute inset-x-0 bottom-0 z-10/, "Solution images must anchor to the media-panel bottom");
assert.match(
  source,
  /h-\[calc\(100%\+3\.5rem\)\][^"]*sm:h-\[calc\(100%\+5\.5rem\)\]/,
  "Solution images must use the approved responsive overflow height",
);
```

- [ ] **Step 2: Run the focused contract and verify RED**

Run: `npm.cmd run test:solution`

Expected: exit 1 with `Solution grid must reserve space for floating visuals`.

- [ ] **Step 3: Implement the minimal responsive overflow layout**

In `components/SolutionSection.vue`, replace the grid class with:

```vue
class="mt-16 grid gap-x-6 gap-y-20 pt-14 sm:grid-cols-2 sm:gap-y-24 sm:pt-[5.5rem] lg:grid-cols-3 lg:gap-y-6"
```

Add `overflow-visible` to the shared `<article>` class.

Replace the media panel and image classes with:

```vue
<div class="relative aspect-[4/3] overflow-visible rounded-xl bg-gray-100">
  <img
    class="absolute inset-x-0 bottom-0 z-10 h-[calc(100%+3.5rem)] w-full object-contain p-5 transition duration-500 group-hover:scale-[1.025] group-focus-within:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none sm:h-[calc(100%+5.5rem)] sm:p-7"
    :src="card.image"
    :alt="card.imageAlt"
  />
</div>
```

- [ ] **Step 4: Run the focused contract and verify GREEN**

Run: `npm.cmd run test:solution`

Expected: exit 0 with `SmartEat solution section integration OK`.

- [ ] **Step 5: Run the complete automated suite**

Run: `npm.cmd test`

Expected: 18 Node tests pass and the content, motion and solution validators print their `OK` messages.

- [ ] **Step 6: Commit the tested layout**

```bash
git add scripts/validate-solution-section.js components/SolutionSection.vue
git commit -m "feat: float solution visuals above cards"
```

---

### Task 2: Build and verify the responsive result

**Files:**
- Modify only if browser evidence proves necessary: `components/SolutionSection.vue`
- Modify only if the contract must reflect a proven correction: `scripts/validate-solution-section.js`

**Interfaces:**
- Consumes: the completed floating-product layout from Task 1.
- Produces: fresh build and browser evidence for every acceptance criterion.

- [ ] **Step 1: Run the production build**

Run: `npm.cmd run build`

Expected: Nuxt exits 0 with no Vue template or Tailwind compilation error.

- [ ] **Step 2: Verify at 1440 × 900**

Open `http://127.0.0.1:3000/#solution` and confirm:

```text
All three products extend above their white cards on one aligned row.
No product is clipped.
The gray media panels and CTA baselines remain aligned.
No horizontal overflow exists.
```

- [ ] **Step 3: Verify at 1024 × 820**

Confirm the three-column layout remains aligned, all products are fully visible, and the roughly 70 px overflow does not collide with the heading.

- [ ] **Step 4: Verify at 390 × 844**

Confirm cards stack with roughly 40 px overflow, the increased row gap prevents overlap, all CTAs stay full-width, and `document.documentElement.scrollWidth <= window.innerWidth`.

- [ ] **Step 5: Check browser errors and motion safeguards**

Require an empty browser error log and confirm the existing `motion-reduce` contract still passes.

- [ ] **Step 6: Apply only evidence-based corrections**

For any observed defect, reproduce it, add or adjust the focused failing assertion, implement the smallest CSS correction, then rerun:

```bash
npm.cmd test
npm.cmd run build
```

- [ ] **Step 7: Commit verified polish only if files changed**

```bash
git add scripts/validate-solution-section.js components/SolutionSection.vue
git commit -m "fix: polish solution visual overflow"
```

Skip this commit if browser verification requires no additional change.
