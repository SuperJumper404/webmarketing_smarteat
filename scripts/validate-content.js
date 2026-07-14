const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const contentPath = path.join(__dirname, "..", "content", "smarteat.fr.json");
const raw = fs.readFileSync(contentPath, "utf8");
const content = JSON.parse(raw);

function assertObject(value, name) {
  assert.equal(typeof value, "object", `${name} must be an object`);
  assert.notEqual(value, null, `${name} must be an object`);
  assert.equal(Array.isArray(value), false, `${name} must be an object`);
}

const requiredTopLevelKeys = [
  "meta",
  "navigation",
  "hero",
  "benefits",
  "problem",
  "solution",
  "features",
  "howItWorks",
  "compliance",
  "roadmap",
  "faq",
  "finalCta",
  "onboarding",
  "footer",
];

assertObject(content, "content");
for (const key of requiredTopLevelKeys) {
  assert.ok(content[key], `Missing top-level key: ${key}`);
}

assertObject(content.meta, "meta");
assert.equal(typeof content.meta.title, "string", "meta.title must be a string");
assert.equal(typeof content.meta.description, "string", "meta.description must be a string");
assert.ok(content.meta.title.length > 10, "meta.title is too short");
assert.ok(content.meta.description.length > 30, "meta.description is too short");

assertObject(content.navigation, "navigation");
assert.ok(Array.isArray(content.navigation.links), "navigation.links must be an array");
assert.ok(content.navigation.links.length >= 4, "navigation.links must contain at least 4 links");
for (const [index, link] of content.navigation.links.entries()) {
  assertObject(link, `navigation.links[${index}]`);
  assert.equal(typeof link.label, "string", `navigation.links[${index}].label must be a string`);
  assert.equal(typeof link.href, "string", `navigation.links[${index}].href must be a string`);
}
assert.equal(typeof content.navigation.primaryCta, "string", "navigation.primaryCta must be a string");
assert.equal(typeof content.navigation.secondaryCta, "string", "navigation.secondaryCta must be a string");

assertObject(content.hero, "hero");
assert.equal(typeof content.hero.title, "string", "hero.title must be a string");
assert.equal(typeof content.hero.subtitle, "string", "hero.subtitle must be a string");
assert.equal(typeof content.hero.primaryCta, "string", "hero.primaryCta must be a string");
assert.equal(typeof content.hero.secondaryCta, "string", "hero.secondaryCta must be a string");
assertObject(content.hero.visual, "hero.visual");
assert.equal(content.hero.visual.type, "carousel", "hero.visual.type must be carousel");
assert.ok(Array.isArray(content.hero.visual.slides), "hero.visual.slides must be an array");
assert.ok(content.hero.visual.slides.length >= 2, "hero.visual.slides must contain at least 2 slides");
for (const [index, slide] of content.hero.visual.slides.entries()) {
  assertObject(slide, `hero.visual.slides[${index}]`);
  assert.equal(typeof slide.src, "string", `hero.visual.slides[${index}].src must be a string`);
  assert.equal(typeof slide.alt, "string", `hero.visual.slides[${index}].alt must be a string`);
}

assert.ok(Array.isArray(content.benefits), "benefits must be an array");
assert.ok(content.benefits.length >= 4, "benefits must contain at least 4 items");
for (const [index, benefit] of content.benefits.entries()) {
  assertObject(benefit, `benefits[${index}]`);
  assert.equal(typeof benefit.title, "string", `benefits[${index}].title must be a string`);
  assert.equal(typeof benefit.text, "string", `benefits[${index}].text must be a string`);
}

assertObject(content.problem, "problem");
if (content.problem.eyebrow) {
  assert.equal(typeof content.problem.eyebrow, "string", "problem.eyebrow must be a string");
}
assert.equal(typeof content.problem.title, "string", "problem.title must be a string");
assert.ok(Array.isArray(content.problem.items), "problem.items must be an array");
assert.ok(content.problem.items.length >= 4, "problem.items must contain at least 4 items");
for (const [index, item] of content.problem.items.entries()) {
  assertObject(item, `problem.items[${index}]`);
  assert.equal(typeof item.title, "string", `problem.items[${index}].title must be a string`);
  assert.equal(typeof item.problem, "string", `problem.items[${index}].problem must be a string`);
  assert.equal(typeof item.solution, "string", `problem.items[${index}].solution must be a string`);
  if (item.image) {
    assert.equal(typeof item.image, "string", `problem.items[${index}].image must be a string`);
    assert.ok(item.image.startsWith("/"), `problem.items[${index}].image must use a public absolute path`);
  }
}

assertObject(content.solution, "solution");
assert.equal(typeof content.solution.eyebrow, "string", "solution.eyebrow must be a string");
assert.equal(typeof content.solution.title, "string", "solution.title must be a string");
assert.equal(typeof content.solution.text, "string", "solution.text must be a string");

assert.ok(Array.isArray(content.features), "features must be an array");
assert.ok(content.features.length >= 6, "features must contain at least 6 items");
for (const [index, feature] of content.features.entries()) {
  assertObject(feature, `features[${index}]`);
  assert.equal(typeof feature.title, "string", `features[${index}].title must be a string`);
  assert.equal(typeof feature.text, "string", `features[${index}].text must be a string`);
  assert.equal(typeof feature.image, "string", `features[${index}].image must be a string`);
  assert.equal(typeof feature.imageAlt, "string", `features[${index}].imageAlt must be a string`);
}

assertObject(content.howItWorks, "howItWorks");
assert.ok(Array.isArray(content.howItWorks.steps), "howItWorks.steps must be an array");
assert.ok(content.howItWorks.steps.length >= 4, "howItWorks.steps must contain at least 4 items");
for (const [index, step] of content.howItWorks.steps.entries()) {
  assertObject(step, `howItWorks.steps[${index}]`);
  assert.equal(typeof step.title, "string", `howItWorks.steps[${index}].title must be a string`);
  assert.equal(typeof step.text, "string", `howItWorks.steps[${index}].text must be a string`);
}

assertObject(content.compliance, "compliance");
assert.equal(typeof content.compliance.eyebrow, "string", "compliance.eyebrow must be a string");
assert.equal(typeof content.compliance.title, "string", "compliance.title must be a string");
assert.equal(typeof content.compliance.text, "string", "compliance.text must be a string");

assertObject(content.roadmap, "roadmap");
assert.ok(Array.isArray(content.roadmap.items), "roadmap.items must be an array");
assert.ok(content.roadmap.items.length >= 5, "roadmap.items must contain at least 5 items");
for (const [index, item] of content.roadmap.items.entries()) {
  assert.equal(typeof item, "string", `roadmap.items[${index}] must be a string`);
}

assert.ok(Array.isArray(content.faq), "faq must be an array");
assert.ok(content.faq.length >= 5, "faq must contain at least 5 items");
for (const [index, item] of content.faq.entries()) {
  assertObject(item, `faq[${index}]`);
  assert.equal(typeof item.question, "string", `faq[${index}].question must be a string`);
  assert.equal(typeof item.answer, "string", `faq[${index}].answer must be a string`);
}

assertObject(content.finalCta, "finalCta");
assert.equal(typeof content.finalCta.title, "string", "finalCta.title must be a string");
assert.equal(typeof content.finalCta.text, "string", "finalCta.text must be a string");
assert.equal(typeof content.finalCta.primaryCta, "string", "finalCta.primaryCta must be a string");
assert.equal(typeof content.finalCta.secondaryCta, "string", "finalCta.secondaryCta must be a string");

assertObject(content.onboarding, "onboarding");
assert.ok(content.onboarding.intro, "onboarding.intro is required");
assertObject(content.onboarding.intro, "onboarding.intro");
assert.equal(typeof content.onboarding.intro.eyebrow, "string", "onboarding.intro.eyebrow must be a string");
assert.ok(Array.isArray(content.onboarding.steps), "onboarding.steps must be an array");
assert.equal(content.onboarding.steps.length, 6, "onboarding.steps must contain exactly 6 steps");
for (const [index, step] of content.onboarding.steps.entries()) {
  assertObject(step, `onboarding.steps[${index}]`);
  assert.equal(typeof step.title, "string", `onboarding.steps[${index}].title must be a string`);
  assert.equal(typeof step.description, "string", `onboarding.steps[${index}].description must be a string`);
}
assert.ok(content.onboarding.fields, "onboarding.fields is required");
assert.ok(content.onboarding.actions, "onboarding.actions is required");
assert.ok(content.onboarding.messages, "onboarding.messages is required");
assertObject(content.onboarding.fields, "onboarding.fields");
assertObject(content.onboarding.actions, "onboarding.actions");
assertObject(content.onboarding.messages, "onboarding.messages");
assert.ok(content.onboarding.options, "onboarding.options is required");
assertObject(content.onboarding.options, "onboarding.options");

const expectedOnboardingOptions = {
  restaurantTypes: ["Restaurant", "Snack", "Café", "Bar", "Food truck", "Autre"],
  menuSources: ["PDF", "Menu papier", "Site web", "Photos", "Pas encore de menu digital"],
  mainNeeds: ["Menu QR", "Prise de commande", "Click & Collect", "Caisse", "Suivi des ventes", "Gestion complète"],
};

assert.ok(Array.isArray(content.onboarding.options.restaurantTypes), "onboarding.options.restaurantTypes must be an array");
assert.ok(Array.isArray(content.onboarding.options.menuSources), "onboarding.options.menuSources must be an array");
assert.ok(Array.isArray(content.onboarding.options.mainNeeds), "onboarding.options.mainNeeds must be an array");
assert.ok(
  content.onboarding.options.restaurantTypes.length >= 4,
  "onboarding.options.restaurantTypes must contain at least 4 items",
);
assert.ok(
  content.onboarding.options.menuSources.length >= 3,
  "onboarding.options.menuSources must contain at least 3 items",
);
assert.ok(
  content.onboarding.options.mainNeeds.length >= 5,
  "onboarding.options.mainNeeds must contain at least 5 items",
);
for (const [index, restaurantType] of content.onboarding.options.restaurantTypes.entries()) {
  assert.equal(
    typeof restaurantType,
    "string",
    `onboarding.options.restaurantTypes[${index}] must be a string`,
  );
}
for (const [index, menuSource] of content.onboarding.options.menuSources.entries()) {
  assert.equal(typeof menuSource, "string", `onboarding.options.menuSources[${index}] must be a string`);
}
for (const [index, mainNeed] of content.onboarding.options.mainNeeds.entries()) {
  assert.equal(typeof mainNeed, "string", `onboarding.options.mainNeeds[${index}] must be a string`);
}
assert.deepEqual(
  content.onboarding.options.restaurantTypes,
  expectedOnboardingOptions.restaurantTypes,
  "onboarding.options.restaurantTypes must match the requested values and order",
);
assert.deepEqual(
  content.onboarding.options.menuSources,
  expectedOnboardingOptions.menuSources,
  "onboarding.options.menuSources must match the requested values and order",
);
assert.deepEqual(
  content.onboarding.options.mainNeeds,
  expectedOnboardingOptions.mainNeeds,
  "onboarding.options.mainNeeds must match the requested values and order",
);

const requiredOnboardingFields = [
  "restaurantName",
  "restaurantNamePlaceholder",
  "phone",
  "phonePlaceholder",
  "city",
  "cityPlaceholder",
  "restaurantType",
  "restaurantTypePlaceholder",
  "tablesCount",
  "tablesCountPlaceholder",
  "currentMenuSource",
  "currentMenuSourcePlaceholder",
  "contactName",
  "contactNamePlaceholder",
  "email",
  "emailPlaceholder",
  "mainNeed",
];
for (const key of requiredOnboardingFields) {
  assert.equal(typeof content.onboarding.fields[key], "string", `onboarding.fields.${key} must be a string`);
}

const requiredOnboardingActions = ["continue", "back", "finish", "close", "sending"];
for (const key of requiredOnboardingActions) {
  assert.equal(typeof content.onboarding.actions[key], "string", `onboarding.actions.${key} must be a string`);
}

const requiredOnboardingMessages = [
  "successTitle",
  "progressPrefix",
  "progressSeparator",
  "error",
  "required",
  "missingPriority",
  "success",
];
for (const key of requiredOnboardingMessages) {
  assert.equal(typeof content.onboarding.messages[key], "string", `onboarding.messages.${key} must be a string`);
}

assertObject(content.footer, "footer");
assert.equal(typeof content.footer.text, "string", "footer.text must be a string");
assert.equal(typeof content.footer.phone, "string", "footer.phone must be a string");
assert.equal(typeof content.footer.whatsapp, "string", "footer.whatsapp must be a string");
assert.equal(typeof content.footer.email, "string", "footer.email must be a string");
assert.equal(typeof content.footer.instagram, "string", "footer.instagram must be a string");
assert.equal(typeof content.footer.phoneHref, "string", "footer.phoneHref must be a string");
assert.equal(typeof content.footer.whatsappHref, "string", "footer.whatsappHref must be a string");
assert.equal(typeof content.footer.emailHref, "string", "footer.emailHref must be a string");
assert.equal(typeof content.footer.instagramHref, "string", "footer.instagramHref must be a string");
assert.equal(content.footer.phoneHref, "tel:0745203343", "footer.phoneHref must match the requested value");
assert.equal(content.footer.whatsappHref, "https://wa.me/33745203343", "footer.whatsappHref must match the requested value");
assert.equal(content.footer.email, "admin@smarteat.fr", "footer.email must match the requested value");
assert.equal(content.footer.emailHref, "mailto:admin@smarteat.fr", "footer.emailHref must match the requested value");
assert.equal(content.footer.instagram, "Instagram smart_eat", "footer.instagram must match the requested value");
assert.equal(
  content.footer.instagramHref,
  "https://www.instagram.com/smart_eat",
  "footer.instagramHref must match the requested value",
);

const normalizedContent = JSON.stringify(content)
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase();
assert.equal(
  /\b(?:certifiee?|certified)\s+nf[\s-]*525\b/.test(normalizedContent),
  false,
  "Content must not claim SmartEat is certified NF525",
);

console.log("SmartEat content JSON OK");
