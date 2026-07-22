# SmartEat Omnichannel Solution Section Design

Date: 2026-07-22  
Status: approved visual and technical direction, pending written-spec review

## Context

The current “La solution SmartEat” section contains only an eyebrow, title and paragraph. It explains that the platform is centralized but does not show how SmartEat works across the restaurant’s physical and digital ordering points. The redesigned section must make the omnichannel promise immediately visible with three product cards inspired by the user-provided reference, while retaining SmartEat’s existing light visual identity.

## Goals

- Show that SmartEat works on a self-service kiosk, at the table or counter, and on a customer phone through a QR code.
- Explain that every ordering point communicates with the same SmartEat system.
- Use three equal, image-led cards that remain clear from desktop to mobile.
- Reuse the three user-provided SmartEat product visuals after removing their baked checkerboard backgrounds.
- Keep the current site identity: white surfaces, soft neutral grays and violet `#7e22ce` accents.

## Non-goals

- Adding a fourth application or delivery card.
- Creating new product pages or changing the page-section order.
- Reworking the features grid, onboarding flow, header, footer or lead form.
- Introducing a new UI dependency.
- Using a black section background, purple neon glow or large hover color inversion.

## Content

The section keeps the eyebrow “La solution SmartEat”.

The heading becomes:

> Unifiez tous vos points de commande avec SmartEat

The supporting paragraph becomes:

> Sur borne, à table, au comptoir ou sur mobile, chaque commande rejoint le même espace.

### Card 1: Borne de commande

- Title: “Borne de commande”
- Description: “Vos clients consultent le menu, commandent et paient en autonomie, même pendant les périodes de forte affluence.”
- CTA: “Voir la prise de commande”
- Destination: `#prise-de-commande`
- Image source: `C:/Users/kalag/Pictures/Smarteat/ChatGPT Image 21 juil. 2026, 22_57_44.png`
- Public output: `/solution-borne.png`
- Alt text: “Borne de commande SmartEat affichant le menu du restaurant”

### Card 2: Sur table et au comptoir

- Title: “Sur table et au comptoir”
- Description: “Votre équipe prend, suit et centralise les commandes depuis le même terminal, en salle comme au comptoir.”
- CTA: “Voir le pilotage”
- Destination: `#tableau-de-bord`
- Image source: `C:/Users/kalag/Pictures/Smarteat/ChatGPT Image 21 juil. 2026, 22_48_59.png`
- Public output: `/solution-comptoir.png`
- Alt text: “Terminal de comptoir SmartEat affichant les commandes et le menu”

### Card 3: Menu QR sur téléphone

- Title: “Menu QR sur téléphone”
- Description: “Le client scanne le QR code, consulte le menu et commande directement depuis sa table avec son téléphone.”
- CTA: “Voir le menu QR”
- Destination: `#menu-qr`
- Image source: `C:/Users/kalag/Downloads/ChatGPT Image 22 juil. 2026, 13_30_50.png`
- Public output: `/solution-qr-mobile.png`
- Alt text: “Téléphone SmartEat avec menu digital et QR code de table”

## Synchronization Band

Below the cards, a full-width light-violet band communicates the shared platform layer.

- Eyebrow: “Un seul écosystème”
- Title: “Tout communique en temps réel”
- Text: “Commandes, produits, prix, tables et disponibilités restent synchronisés dans SmartEat.”
- Three compact labels: “Borne”, “Comptoir” and “QR mobile”
- A central synchronization icon uses an installed Heroicon, not a new asset.

The band must read as the system connecting the three cards, not as a fourth product card.

## Visual Design

- The section remains on a soft `gray-50` background.
- The heading is centered, spans the available width and uses the same large section-title scale already established on the page: `text-4xl`, `sm:text-5xl`, `lg:text-6xl`.
- The three cards use a white background, rounded `2xl` corners, a very light gray border and a soft neutral shadow.
- Each card has the same height and uses a vertical flex layout so the CTA stays aligned at the bottom.
- Each image sits inside an equal `4:3` light-gray media panel with `object-contain`; device proportions are preserved and never cropped.
- CTAs use the compact rounded SmartEat outline/button treatment already used elsewhere on the site.
- Hover translates the card upward by 8 px and scales the image to `1.025`. It does not turn the card black or introduce a neon border.
- Focus states use the existing `primary-100` ring and remain clearly visible.

## Image Treatment

The three supplied PNGs are 24-bit RGB files with an opaque checkerboard baked into the pixels. They are not genuinely transparent.

During implementation:

1. Edit each supplied image to remove only the checkerboard background.
2. Preserve the device, SmartEat logo, screen contents, proportions and existing soft product shadow.
3. Export a true transparent PNG using the exact public filenames defined above.
4. Inspect each result at original resolution before adding it to the section.
5. Do not regenerate or rewrite interface text unnecessarily; the product screens are part of the supplied visual identity.

If a perfect checkerboard removal would materially damage the white device edges, keep a very light neutral matte immediately around the device rather than altering the product itself. The final card media panels will hide small neutral edge transitions.

## Responsive Behavior

- At `lg` widths, all three cards appear in one equal three-column row.
- Between mobile and `lg`, the layout uses two columns. The third card spans both columns, is centered and is constrained to the width of one grid column.
- At 390 px, cards stack in the order kiosk, counter/table, phone QR.
- The synchronization band becomes a vertical block on mobile; its three labels wrap without horizontal scrolling.
- Media panels retain equal aspect ratios at every breakpoint.
- The section must not create horizontal overflow at 1440 px, 1024 px or 390 px.

## Component and Data Architecture

### `SolutionSection.vue`

The existing component remains the owner of the section. It renders:

1. The eyebrow, heading and supporting paragraph.
2. A `v-for` grid over `content.cards`.
3. The synchronization band from `content.sync`.

No new Vue component is required because the three cards belong exclusively to this small section and share a single rendering pattern.

### `smarteat.fr.json`

The `solution` object gains:

- `cards`: exactly three objects with `id`, `title`, `text`, `image`, `imageAlt`, `ctaLabel` and `href`.
- `sync`: an object with `eyebrow`, `title`, `text` and exactly three `items`.

The section remains entirely content-driven. Future text or link changes do not require template edits.

### Content validation

`scripts/validate-content.js` will validate:

- Exactly three solution cards.
- Non-empty labels, text, image paths, alt text and destinations.
- Unique card IDs.
- Public image paths beginning with `/`.
- The three required synchronization labels.
- Local card destinations against the existing known-anchor set.

## Accessibility

- Each card is a semantic `article` with an `h3` heading.
- Every image has the approved descriptive alt text.
- Every CTA is a real anchor with a visible focus state.
- The synchronization icon is decorative and hidden from assistive technology.
- Reduced-motion users receive no card translation or image-scale animation.
- Text contrast meets the existing site’s white/gray/violet contrast pattern.

## Testing Strategy

### Automated checks

- Extend and run `npm run test:content` for the new schema.
- Run the existing `npm test` suite.
- Run `npm run build` from `web_marketing_qr_menu`.
- Confirm the three public PNG assets exist and expose actual alpha transparency.

### Browser verification

- Desktop: 1440 px and 1024 px.
- Mobile: 390 px.
- Confirm equal media-panel and card alignment.
- Confirm all CTA destinations land below the sticky header.
- Confirm no horizontal overflow.
- Confirm focus states and reduced-motion behavior.
- Confirm the three devices remain readable without cropping.

## Acceptance Criteria

- A visitor can identify the kiosk, counter/table and phone QR use cases without reading the body copy.
- The section clearly states that every ordering point shares synchronized SmartEat data.
- All three supplied product visuals appear with clean transparent backgrounds on consistent media panels.
- The cards remain balanced at desktop, tablet and mobile widths.
- Each CTA reaches the intended existing capability.
- No other landing-page section or flow changes.
- The existing automated suite and Nuxt production build complete successfully.
