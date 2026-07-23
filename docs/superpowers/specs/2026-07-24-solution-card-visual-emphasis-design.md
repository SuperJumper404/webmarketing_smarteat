# Renforcement des visuels de la section Solution SmartEat

## Objectif

Donner davantage de présence aux trois appareils de la section Solution en agrandissant les images et en accentuant leur dépassement au-dessus des cartes, tout en unifiant chaque carte sur une seule couleur blanche.

## Périmètre

- Modifier uniquement la présentation des trois cartes dans `components/SolutionSection.vue`.
- Conserver les images, textes, liens, boutons, bordures, ombres et animations actuels.
- Ne pas modifier le bandeau de synchronisation ni les autres cartes du site.

## Composition retenue

La surface de chaque carte et la zone située derrière son image utilisent le même fond blanc. Le panneau média conserve son format `4/3`, mais perd son fond gris afin que la carte apparaisse comme une surface continue.

Les images restent ancrées au bas du panneau média avec `object-contain`. Leur hauteur augmente d’environ 25 % visuellement, en combinant une hauteur responsive plus importante et un padding interne réduit. Le débordement cible est d’environ 50 px sur mobile et 85 px sur tablette et desktop.

## Responsive et espacement

- Mobile : trois cartes empilées, débordement d’environ 50 px et espace vertical suffisant entre les rangées.
- Tablette : deux cartes puis une carte centrée, avec environ 85 px de débordement et aucune collision entre les rangées.
- Desktop : trois cartes sur une ligne avec des sommets visuels cohérents.
- L’espace supérieur réservé à la grille augmente avec le débordement.
- Les hauteurs de cartes, les titres, les paragraphes et les CTA restent alignés comme actuellement.

## Mouvement et accessibilité

Le mouvement existant reste inchangé : la carte se soulève au survol et le produit s’agrandit légèrement. Les variantes `motion-reduce` continuent de neutraliser les transformations et transitions.

## Validation

- Étendre `scripts/validate-solution-section.js` avant le changement visuel pour exiger le fond blanc unique, le nouveau débordement responsive et le padding réduit.
- Vérifier que ce contrat échoue pour la raison attendue, puis qu’il passe après l’implémentation.
- Lancer la suite complète et le build Nuxt.
- Contrôler visuellement la section à 1440 px, 1024 px et 390 px.

## Critères d’acceptation

- Les trois appareils sont sensiblement plus grands sans être coupés.
- Le dépassement est proche de 50 px sur mobile et de 85 px sur tablette et desktop.
- Chaque carte apparaît entièrement blanche, sans panneau gris derrière l’image.
- Aucun chevauchement ni débordement horizontal n’apparaît.
- Les textes et CTA conservent leur alignement actuel.
