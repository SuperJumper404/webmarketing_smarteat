# Visuels XXL de la section Solution SmartEat

## Objectif

Donner un impact beaucoup plus spectaculaire aux trois appareils de la section Solution en augmentant fortement leur taille et leur dépassement au-dessus des cartes.

## Périmètre

- Modifier uniquement les classes de présentation des trois cartes dans `components/SolutionSection.vue`.
- Conserver les cartes entièrement blanches.
- Conserver les images, textes, liens, boutons, bordures, ombres et animations actuels.
- Ne pas modifier le bandeau de synchronisation ni les autres sections.

## Proportions retenues

Les images restent ancrées au bas du panneau média avec `object-contain`. Leur padding interne devient minimal afin que les appareils occupent presque toute la largeur disponible.

- Mobile : débordement cible d’environ 80 px au-dessus de la carte.
- Tablette et desktop : débordement cible d’environ 125 px.
- Le panneau média conserve son format `4/3` et son fond blanc.

## Espacement responsive

La grille réserve davantage d’espace au-dessus des cartes pour absorber les visuels XXL sans les rapprocher du titre. Les espacements verticaux entre rangées augmentent également sur mobile et tablette afin que le visuel d’une carte ne rencontre jamais la carte précédente.

La grille existante reste inchangée dans sa structure : une colonne sur mobile, deux colonnes sur tablette avec la troisième carte centrée, puis trois colonnes sur desktop.

## Contenu, mouvement et accessibilité

Les hauteurs des cartes, l’alignement des textes et les CTA restent cohérents. Le soulèvement de la carte et le léger zoom produit au survol sont conservés, tout comme les variantes `motion-reduce`.

## Validation

- Étendre le contrat CSS avant l’implémentation et confirmer son échec sur les proportions actuelles.
- Implémenter les nouvelles hauteurs, les espacements et le padding minimal.
- Confirmer ensuite le succès du contrat, de la suite complète et du build Nuxt.
- Mesurer le résultat à 390 × 844, 1024 × 820 et 1440 × 900.

## Critères d’acceptation

- Le dépassement mesuré est proche de 80 px sur mobile et de 125 px sur tablette et desktop.
- Les trois appareils restent entièrement visibles.
- Aucun chevauchement entre rangées ni débordement horizontal n’apparaît.
- Les cartes restent entièrement blanches.
- Les CTA conservent leur alignement actuel.
