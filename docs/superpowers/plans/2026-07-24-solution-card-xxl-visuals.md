# Solution Card XXL Visuals Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Porter les trois visuels produits à un débordement XXL d’environ 80 px sur mobile et 125 px sur tablette/desktop.

**Architecture:** Conserver le composant et sa grille actuels, puis remplacer uniquement les classes Tailwind qui pilotent la hauteur des images, leur padding et les espacements de grille. Le validateur statique existant est mis à jour avant le composant afin d’obtenir un cycle RED-GREEN mesurable.

**Tech Stack:** Nuxt 3, Vue 3, Tailwind CSS, Node.js `assert`, navigateur local SmartEat.

## Global Constraints

- Modifier uniquement les classes de présentation des trois cartes dans `components/SolutionSection.vue`.
- Conserver les cartes entièrement blanches.
- Conserver les images, textes, liens, boutons, bordures, ombres et animations actuels.
- Le débordement cible est d’environ 80 px sur mobile et 125 px sur tablette et desktop.
- Aucun chevauchement ni débordement horizontal ne doit apparaître.

---

### Task 1: Appliquer les proportions XXL

**Files:**
- Modify: `scripts/validate-solution-section.js`
- Modify: `components/SolutionSection.vue`

**Interfaces:**
- Consumes: les cartes `content.cards` et le panneau média `aspect-[4/3]` existants.
- Produces: des images ancrées au bas du panneau avec environ 80 px et 125 px de dépassement responsive.

- [ ] **Step 1: Écrire le contrat CSS qui échoue**

Remplacer l’assertion de grille et l’assertion de proportions dans `scripts/validate-solution-section.js` :

```js
assert.match(
  source,
  /gap-y-32[^"]*pt-24[^"]*sm:gap-y-40[^"]*sm:pt-36[^"]*lg:gap-y-6/,
  "Solution grid must reserve enough space for XXL floating visuals",
);
assert.match(
  source,
  /h-\[calc\(100%\+6rem\)\][^"]*p-1[^"]*sm:h-\[calc\(100%\+9rem\)\][^"]*sm:p-2/,
  "Solution images must use the approved XXL responsive proportions",
);
```

Conserver l’assertion existante qui exige `bg-white` sur le panneau média.

- [ ] **Step 2: Vérifier l’échec attendu**

Run: `npm run test:solution`

Expected: FAIL avec `Solution grid must reserve enough space for XXL floating visuals`, car le composant utilise encore les proportions précédentes.

- [ ] **Step 3: Implémenter les classes XXL**

Dans `components/SolutionSection.vue`, remplacer la grille par :

```vue
<div class="mt-16 grid gap-x-6 gap-y-32 pt-24 sm:grid-cols-2 sm:gap-y-40 sm:pt-36 lg:grid-cols-3 lg:gap-y-6">
```

Remplacer les classes de l’image par :

```vue
<img
  class="absolute inset-x-0 bottom-0 z-10 h-[calc(100%+6rem)] w-full object-contain p-1 transition duration-500 group-hover:scale-[1.025] group-focus-within:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none sm:h-[calc(100%+9rem)] sm:p-2"
  :src="card.image"
  :alt="card.imageAlt"
/>
```

- [ ] **Step 4: Vérifier le contrat et la suite complète**

Run: `npm run test:solution`

Expected: `SmartEat solution section integration OK`.

Run: `npm test`

Expected: 18 tests Node réussis, puis les validateurs de contenu, mouvement et solution réussis.

- [ ] **Step 5: Vérifier le build**

Run: `npm run build`

Expected: exit code 0 et build Nuxt/Nitro généré.

- [ ] **Step 6: Contrôler visuellement les trois formats**

Ouvrir `http://127.0.0.1:3000/#solution` et contrôler à 1440 × 900, 1024 × 820 et 390 × 844 :

- Débordement proche de 125 px sur desktop/tablette et 80 px sur mobile.
- Images entièrement visibles.
- Panneaux média et cartes tous blancs.
- Aucun chevauchement entre rangées.
- Aucun débordement horizontal.
- CTA toujours alignés.

- [ ] **Step 7: Relire et committer**

Run: `git diff --check -- components/SolutionSection.vue scripts/validate-solution-section.js`

Expected: aucune erreur d’espace.

```bash
git add components/SolutionSection.vue scripts/validate-solution-section.js
git commit -m "feat: scale solution visuals to XXL"
```
