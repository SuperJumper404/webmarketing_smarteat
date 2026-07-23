# Solution Card Visual Emphasis Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agrandir les trois visuels produits, accentuer leur dépassement responsive et rendre chaque carte entièrement blanche.

**Architecture:** Conserver la structure actuelle de `SolutionSection.vue` et modifier uniquement ses classes Tailwind de grille, de panneau média et d’image. Le validateur statique existant sert de contrat de régression et doit échouer avant l’implémentation, puis passer avec les nouvelles proportions.

**Tech Stack:** Nuxt 3, Vue 3, Tailwind CSS, Node.js `assert`, navigateur local SmartEat.

## Global Constraints

- Modifier uniquement la présentation des trois cartes dans `components/SolutionSection.vue`.
- Conserver les images, textes, liens, boutons, bordures, ombres et animations actuels.
- Le débordement cible est d’environ 50 px sur mobile et 85 px sur tablette et desktop.
- Chaque carte et sa zone média utilisent un fond blanc unique.
- Aucun chevauchement ni débordement horizontal ne doit apparaître.

---

### Task 1: Renforcer les visuels et unifier le fond des cartes

**Files:**
- Modify: `scripts/validate-solution-section.js`
- Modify: `components/SolutionSection.vue`

**Interfaces:**
- Consumes: le contenu `content.cards` et la grille responsive existante de `SolutionSection.vue`.
- Produces: trois cartes avec panneau média blanc, images agrandies et débordement responsive contrôlé.

- [ ] **Step 1: Écrire le contrat CSS qui échoue**

Remplacer les assertions de proportions existantes et ajouter le fond unique dans `scripts/validate-solution-section.js` :

```js
assert.match(source, /gap-y-24[^\"]*pt-16[^\"]*sm:gap-y-28[^\"]*sm:pt-28[^\"]*lg:gap-y-6/, "Solution grid must reserve enough space for larger floating visuals");
assert.match(source, /aspect-\[4\/3\][^\"]*overflow-visible[^\"]*bg-white/, "Solution media panels must share the white card background");
assert.match(
  source,
  /h-\[calc\(100%\+4\.25rem\)\][^\"]*p-3[^\"]*sm:h-\[calc\(100%\+6\.5rem\)\][^\"]*sm:p-4/,
  "Solution images must use the approved larger responsive proportions",
);
```

- [ ] **Step 2: Vérifier l’échec attendu**

Run: `npm run test:solution`

Expected: FAIL avec `Solution grid must reserve enough space for larger floating visuals` parce que les anciennes classes sont encore présentes.

- [ ] **Step 3: Implémenter les nouvelles proportions**

Dans `components/SolutionSection.vue`, utiliser les classes suivantes :

```vue
<div class="mt-16 grid gap-x-6 gap-y-24 pt-16 sm:grid-cols-2 sm:gap-y-28 sm:pt-28 lg:grid-cols-3 lg:gap-y-6">
```

```vue
<div class="relative aspect-[4/3] overflow-visible rounded-xl bg-white">
  <img
    class="absolute inset-x-0 bottom-0 z-10 h-[calc(100%+4.25rem)] w-full object-contain p-3 transition duration-500 group-hover:scale-[1.025] group-focus-within:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none sm:h-[calc(100%+6.5rem)] sm:p-4"
    :src="card.image"
    :alt="card.imageAlt"
  />
</div>
```

- [ ] **Step 4: Vérifier le contrat puis la suite complète**

Run: `npm run test:solution`

Expected: `SmartEat solution section integration OK`.

Run: `npm test`

Expected: 18 tests Node réussis, puis les validateurs de contenu, mouvement et solution réussis.

- [ ] **Step 5: Vérifier le build de production**

Run: `npm run build`

Expected: exit code 0 et build Nuxt/Nitro généré.

- [ ] **Step 6: Vérifier visuellement le responsive**

Ouvrir `http://127.0.0.1:3000/#solution` et contrôler à 1440 × 900, 1024 × 820 et 390 × 844 :

- Le panneau média est blanc comme la carte.
- Le dépassement mesuré est proche de 50 px sur mobile et 85 px sur tablette/desktop.
- Les trois images sont entièrement visibles.
- Les rangées ne se chevauchent pas et la page n’a pas de débordement horizontal.
- Les CTA restent alignés au bas des cartes.

- [ ] **Step 7: Relire et committer le changement**

Run: `git diff --check`

Expected: aucune erreur d’espace ou de fin de ligne.

```bash
git add components/SolutionSection.vue scripts/validate-solution-section.js
git commit -m "feat: strengthen solution card visuals"
```
