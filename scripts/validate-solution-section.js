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
assert.match(source, /pt-14[^"]*sm:pt-\[5\.5rem\]/, "Solution grid must reserve space for floating visuals");
assert.match(source, /gap-y-20[^"]*sm:gap-y-24[^"]*lg:gap-y-6/, "Wrapped solution cards must not overlap");
assert.match(source, /aspect-\[4\/3\][^"]*overflow-visible/, "Solution media panels must expose overflowing images");
assert.match(source, /absolute inset-x-0 bottom-0 z-10/, "Solution images must anchor to the media-panel bottom");
assert.match(
  source,
  /h-\[calc\(100%\+3\.5rem\)\][^"]*sm:h-\[calc\(100%\+5\.5rem\)\]/,
  "Solution images must use the approved responsive overflow height",
);

console.log("SmartEat solution section integration OK");
