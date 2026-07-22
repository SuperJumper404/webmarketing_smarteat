# Dépassement des visuels de la section Solution SmartEat

## Objectif

Faire flotter les trois visuels produits au-dessus du bord supérieur de leur carte, comme sur la référence fournie, afin de donner plus de présence aux appareils sans modifier le contenu de la section.

## Périmètre

- Modifier uniquement la présentation des trois cartes de `SolutionSection.vue`.
- Conserver les trois images, textes, liens, couleurs et le bandeau de synchronisation actuels.
- Ne pas modifier les autres grilles ou cartes du site.

## Composition retenue

Chaque carte conserve sa surface blanche, sa bordure légère, son ombre et son contenu aligné. La grille reçoit un espace supérieur réservé au débordement. Le panneau gris de l’image commence à l’intérieur de la carte, tandis que le visuel transparent est déplacé vers le haut avec une marge négative contrôlée et reste visible grâce à un débordement non masqué.

Le dépassement cible est d’environ 70 px sur desktop et tablette. Sur mobile, il est réduit à environ 40 px afin de préserver le rythme vertical et d’éviter que deux cartes se rapprochent excessivement.

## Responsive et alignement

- Desktop : trois cartes sur une ligne, trois appareils dépassant à la même hauteur visuelle.
- Tablette : la grille actuelle est conservée, y compris le centrage de la troisième carte lorsqu’elle passe seule sur une ligne.
- Mobile : cartes empilées, débordement réduit et espace suffisant entre deux cartes.
- Les panneaux médias conservent un format identique et les images restent entièrement visibles avec `object-contain`.
- Les titres, paragraphes et CTA restent dans le flux normal ; leurs alignements actuels ne changent pas.

## Mouvement et accessibilité

Le survol existant reste inchangé : légère surélévation de la carte et agrandissement mesuré du visuel. Les classes `motion-reduce` continuent de supprimer les transformations et transitions pour les utilisateurs concernés.

## Validation

- Étendre le contrat de `scripts/validate-solution-section.js` pour exiger un espace supérieur de grille, un débordement visible et un décalage négatif responsive du média.
- Vérifier d’abord l’échec du contrat, puis son succès après le changement CSS.
- Lancer la suite complète et le build Nuxt.
- Contrôler visuellement la section à 1440 px, 1024 px et 390 px, avec aucune image coupée et aucun débordement horizontal.

## Critères d’acceptation

- Les trois appareils dépassent clairement du haut des cartes blanches.
- Le résultat rappelle la référence sans copier ses couleurs ou sa typographie.
- Aucun appareil n’est coupé.
- Les cartes et leurs CTA restent alignés.
- La version mobile reste lisible et sans chevauchement.
