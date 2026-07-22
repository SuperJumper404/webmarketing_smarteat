# SmartEat Mega Menu Design

Date: 2026-07-22  
Status: approved design, pending implementation plan

## Context

The current SmartEat header exposes four flat anchor links: Produit, Solution, FAQ and Contact. The landing page contains enough product depth that this navigation no longer explains the platform effectively. The new navigation must prioritize product discovery while preserving the existing demo and phone conversion paths.

## Goals

- Make the six current SmartEat capabilities understandable directly from the header.
- Keep the header visually light while providing a rich full-width product panel.
- Use the current single-page anchors now and allow links to become dedicated routes later without changing component structure.
- Preserve the existing SmartEat identity: white surfaces, neutral grays and violet `#7e22ce`.
- Provide equivalent, accessible navigation on desktop, keyboard and mobile.

## Non-goals

- Creating new product pages in this change.
- Adding pricing, testimonials or marketing claims that do not exist in the current content.
- Changing the lead-onboarding flow, footer or body-section ordering.
- Introducing a new UI dependency.

## Information Architecture

The desktop header contains these primary entries:

1. **Produit** — button that opens the mega menu.
2. **Pourquoi SmartEat** — direct anchor to the `ProblemSection` narrative at `#pourquoi-smarteat`.
3. **Comment ça marche** — direct anchor to the onboarding/process section.
4. **FAQ** — direct anchor to the FAQ section.

The right side keeps:

- The phone number and “À votre écoute” label.
- The outlined “Nous contacter” action.
- The primary “Demander une démo” action.

### Mega menu groups

The panel begins with “Explorer SmartEat” and the headline “Tout ce qu’il faut pour vendre, servir et piloter”. It contains two functional groups.

**Commander et vendre**

- Menu QR personnalisable — “Un menu digital à l’image du restaurant.”
- Prise de commande — “Centraliser les commandes et réduire les erreurs.”
- Click & Collect — “Vendre aussi en dehors du service en salle.”

**Gérer et piloter**

- Tableau de bord — “Suivre les ventes et les tendances.”
- Plan de table et QR codes — “Organiser les tables et le parcours client.”
- Journal des ventes — “Conserver une activité claire et structurée.”

The third column is a highlighted overview card titled “Découvrir SmartEat”. It links to the general solution section. A compact footer row links to the roadmap and mentions the existing future capabilities: stocks, reservations, SMS marketing and mobile payments.

## Link Strategy

Every menu entry is driven by data and has a stable `href`. During this implementation, the six capability links point to newly added page anchors. The navigation schema does not distinguish anchors from routes; a future value such as `/produit/menu-qr` can replace `#menu-qr` without component changes.

Required new anchors:

- `#pourquoi-smarteat`
- `#menu-qr`
- `#prise-de-commande`
- `#click-and-collect`
- `#tableau-de-bord`
- `#plan-de-table`
- `#journal-des-ventes`
- `#roadmap`

Existing anchors `#solution`, `#contact` and `#faq` remain valid.

## Desktop Layout

- The sticky header remains at the top with its current translucent white background and blur.
- The mega panel is anchored immediately below the header and constrained to the existing `max-w-[86rem]` page width.
- The panel uses three columns: two equal navigation columns and a slightly narrower highlighted overview column.
- The panel uses rounded corners, a light neutral border and a large neutral shadow. It does not use a black surface or purple neon glow.
- Capability links include a small Heroicon, title and one-line description.
- Hover and focus states use `primary-50` backgrounds and `primary-700` text accents.

## Desktop Interaction

- Pointer entry on the Produit trigger opens the panel after approximately 120 ms.
- Pointer exit schedules closure after approximately 220 ms, allowing the pointer to cross the gap into the panel without flicker.
- Hovering the panel cancels pending closure.
- Clicking the Produit trigger toggles the panel independently of hover.
- Clicking outside, selecting a destination or pressing Escape closes the panel.
- Enter and Space operate the trigger; Tab follows the natural link order.
- Focus is not trapped because the panel is site navigation rather than a modal dialog.
- `aria-expanded` and `aria-controls` reflect the current state.

All timers and document listeners are removed when the header component unmounts.

## Mobile Navigation

- The existing mobile header trigger continues to open the main navigation panel.
- Produit becomes an accordion row inside that panel.
- Expanding Produit reveals the two functional groups and their capability links.
- Pourquoi SmartEat, Comment ça marche and FAQ remain direct rows.
- The contact and demo actions remain stacked at the bottom.
- Selecting any link closes both the product accordion and the main mobile menu.
- Mobile behavior never depends on hover.

## Component Architecture

### `MarketingHeader.vue`

Owns the main header layout, desktop open state, mobile menu state, opening/closing timers, outside-click handling and Escape handling. It passes content to the mega-menu panel and closes navigation when a destination is selected.

### `MarketingMegaMenu.vue`

A new presentational component responsible for rendering the panel groups, links, overview card and roadmap row. It receives a `menu` object and emits a `select` event. It does not own global listeners or navigation state.

### `smarteat.fr.json`

The `navigation` object gains a `megaMenu` object containing the label, overview link, grouped capability items, highlighted card and roadmap link. Direct header links remain in a separate `links` array.

### Feature anchors

`FeaturesSection.vue` assigns the configured identifier to each rendered feature article. The related content entries gain an `id` property. The problem/benefit narrative and roadmap sections receive their stable section IDs.

## Data Flow and Fallbacks

`app.vue` continues loading the single localized JSON document and passes `content.navigation` to `MarketingHeader`. The header passes `content.megaMenu` to `MarketingMegaMenu`.

If `megaMenu` or its groups are missing, the header renders a flat Produit link to `#solution` instead of an empty trigger. Empty groups are not rendered. Invalid or duplicate anchors are rejected by the content validation script.

## Motion and Reduced Motion

The desktop panel uses a short opacity and vertical translation transition. Nested items do not cascade with long delays. When `prefers-reduced-motion: reduce` is active, the panel appears and disappears without transforms or transition delay.

## Testing Strategy

### Automated checks

- Extend `scripts/validate-content.js` to validate the mega-menu schema.
- Assert that labels and `href` values are non-empty.
- Assert that capability IDs and navigation targets are unique.
- Assert that every local `#anchor` used by the menu exists in the content/component mapping.
- Run the existing `npm test` suite.
- Run `npm run build`.

### Browser verification

- Desktop widths: 1440 px and 1024 px.
- Mobile width: 390 px.
- Confirm no horizontal overflow.
- Confirm hover timing does not flicker while crossing from trigger to panel.
- Confirm click, outside click and Escape behavior.
- Confirm full keyboard traversal and visible focus states.
- Confirm mobile accordion behavior and menu closure after selection.
- Confirm reduced-motion behavior.

## Acceptance Criteria

- A visitor can identify all six current SmartEat capabilities without scrolling the page.
- Every menu destination lands on the intended section or feature.
- The panel works with pointer, click and keyboard input.
- The mobile menu exposes the same product information without relying on hover.
- Existing phone and demo actions remain available on desktop and mobile.
- Missing mega-menu data falls back to a usable flat navigation link.
- The existing test suite and Nuxt production build complete successfully.
