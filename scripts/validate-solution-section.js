const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const componentPath = path.join(__dirname, "..", "components", "SolutionSection.vue");
const source = fs.readFileSync(componentPath, "utf8");

assert.match(source, /v-for="\(card, index\) in content\.cards"/, "Solution cards must be content-driven");
assert.match(source, /<article/, "Solution cards must use semantic articles");
assert.match(source, /content\.sync\.title/, "Solution section must render the synchronization band");
assert.match(source, /sm:grid-cols-2/, "Solution section must use the approved tablet grid");
assert.match(source, /lg:grid-cols-3/, "Solution section must use the approved desktop grid");
assert.match(source, /motion-reduce:transform-none/, "Solution motion must respect reduced-motion preferences");
assert.match(source, /ArrowsRightLeftIcon/, "Synchronization band must use the approved connection icon");
assert.match(source, /class="[^"]*mb-7[^"]*"[^>]*>\s*\{\{ card\.text \}\}/, "Solution copy must preserve CTA spacing");
assert.match(source, /class="[^"]*mt-auto[^"]*"[^>]*>\s*\{\{ card\.ctaLabel \}\}/, "Solution CTAs must align to the card bottom");

console.log("SmartEat solution section integration OK");
