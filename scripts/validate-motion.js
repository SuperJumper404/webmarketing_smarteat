const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const root = path.join(__dirname, "..");
const nuxtConfig = fs.readFileSync(path.join(root, "nuxt.config.ts"), "utf8");
const plugin = fs.readFileSync(path.join(root, "plugins", "motion-v.client.js"), "utf8");

assert.doesNotMatch(nuxtConfig, /['"]motion-v\/nuxt['"]/, "Nuxt 3.5 must not use the incompatible motion-v Nuxt module");
assert.match(plugin, /MotionPlugin/, "Motion plugin must register MotionPlugin");
assert.match(plugin, /vueApp\.use\(MotionPlugin\)/, "Motion plugin must install MotionPlugin on the Vue app");

const animatedComponents = [
  "HeroSection.vue",
  "BenefitsSection.vue",
  "FeaturesSection.vue",
  "FinalCtaSection.vue",
  "MarketingCta.vue",
];

for (const fileName of animatedComponents) {
  const filePath = path.join(root, "components", fileName);
  const source = fs.readFileSync(filePath, "utf8");
  assert.match(source, /v-motion/, `${fileName} must use Motion animations`);
}

const heroSource = fs.readFileSync(path.join(root, "components", "HeroSection.vue"), "utf8");
assert.match(heroSource, /titleWords/, "Hero title must be split into words for a styled reveal");
assert.match(heroSource, /wordMotion\(index\)/, "Hero title words must use a staggered Motion animation");

console.log("SmartEat Motion integration OK");
