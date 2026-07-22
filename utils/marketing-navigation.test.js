const test = require("node:test");
const assert = require("node:assert/strict");
const { normalizeMegaMenu } = require("./marketing-navigation");

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
