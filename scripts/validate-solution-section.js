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
assert.match(
  source,
  /gap-y-32[^"]*pt-24[^"]*sm:gap-y-40[^"]*sm:pt-36[^"]*lg:gap-y-6/,
  "Solution grid must reserve enough space for XXL floating visuals",
);
assert.match(
  source,
  /aspect-\[4\/3\][^"]*overflow-visible[^"]*bg-white/,
  "Solution media panels must share the white card background",
);
assert.match(source, /absolute inset-x-0 bottom-0 z-10/, "Solution images must anchor to the media-panel bottom");
assert.match(
  source,
  /h-\[calc\(100%\+6rem\)\][^"]*p-1[^"]*sm:h-\[calc\(100%\+9rem\)\][^"]*sm:p-2/,
  "Solution images must use the approved XXL responsive proportions",
);

console.log("SmartEat solution section integration OK");
