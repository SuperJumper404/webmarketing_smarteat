const test = require("node:test");
const assert = require("node:assert/strict");

const {
  normalizeLeadPayload,
  getLeadStage,
  buildLeadEmail,
} = require("./lead-utils");

test("normalizes lead payload and trims string fields", () => {
  const result = normalizeLeadPayload({
    leadId: " lead-1 ",
    intent: "account",
    step: "2",
    restaurantName: "  Le Bistrot  ",
    phone: " 0612345678 ",
    unknownField: "ignored",
  });

  assert.deepEqual(result, {
    leadId: "lead-1",
    intent: "account",
    step: 2,
    restaurantName: "Le Bistrot",
    phone: "0612345678",
    city: "",
    restaurantType: "",
    tablesCount: "",
    currentMenuSource: "",
    contactName: "",
    email: "",
    mainNeed: "",
  });
});

test("classifies a restaurant-only lead as draft", () => {
  const lead = normalizeLeadPayload({
    restaurantName: "Maison Test",
    step: 1,
  });

  assert.equal(getLeadStage(lead), "draft");
});

test("classifies a lead with phone as callable", () => {
  const lead = normalizeLeadPayload({
    restaurantName: "Maison Test",
    phone: "0612345678",
    step: 2,
  });

  assert.equal(getLeadStage(lead), "callable");
});

test("builds a readable email for a callable demo lead", () => {
  const lead = normalizeLeadPayload({
    leadId: "lead-123",
    intent: "demo",
    step: 2,
    restaurantName: "Maison Test",
    phone: "0612345678",
  });

  const email = buildLeadEmail(lead);

  assert.equal(email.subject, "[SmartEat] Lead demo - Maison Test");
  assert.match(email.text, /Statut: callable/);
  assert.match(email.text, /Restaurant: Maison Test/);
  assert.match(email.text, /Telephone: 0612345678/);
});

test("empty payload produces empty stage but safe email output", () => {
  const lead = normalizeLeadPayload({});
  const email = buildLeadEmail(lead);

  assert.equal(getLeadStage(lead), "empty");
  assert.equal(email.subject, "[SmartEat] Lead demo - Restaurant sans nom");
  assert.match(email.text, /Restaurant: -/);
});
