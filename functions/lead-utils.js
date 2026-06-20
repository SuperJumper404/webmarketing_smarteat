const FIELDS = [
  "leadId",
  "intent",
  "restaurantName",
  "phone",
  "city",
  "restaurantType",
  "tablesCount",
  "currentMenuSource",
  "contactName",
  "email",
  "mainNeed",
];

function cleanString(value) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function normalizeLeadPayload(payload = {}) {
  const normalized = {};

  for (const field of FIELDS) {
    normalized[field] = cleanString(payload[field]);
  }

  const parsedStep = Number(payload.step);
  normalized.step = Number.isFinite(parsedStep) && parsedStep > 0 ? parsedStep : 1;
  normalized.intent = normalized.intent === "account" ? "account" : "demo";

  return normalized;
}

function getLeadStage(lead) {
  if (lead.phone) return "callable";
  if (lead.restaurantName) return "draft";
  return "empty";
}

function valueOrDash(value) {
  return value || "-";
}

function buildLeadEmail(lead) {
  const stage = getLeadStage(lead);
  const restaurant = lead.restaurantName || "Restaurant sans nom";
  const intentLabel = lead.intent === "account" ? "compte" : "demo";

  const subject = `[SmartEat] Lead ${intentLabel} - ${restaurant}`;
  const text = [
    "Nouveau lead SmartEat",
    "",
    `Statut: ${stage}`,
    `Intention: ${lead.intent}`,
    `Etape: ${lead.step}`,
    `Lead ID: ${valueOrDash(lead.leadId)}`,
    "",
    `Restaurant: ${valueOrDash(lead.restaurantName)}`,
    `Telephone: ${valueOrDash(lead.phone)}`,
    `Ville: ${valueOrDash(lead.city)}`,
    `Type d'etablissement: ${valueOrDash(lead.restaurantType)}`,
    `Nombre de tables: ${valueOrDash(lead.tablesCount)}`,
    `Menu actuel: ${valueOrDash(lead.currentMenuSource)}`,
    `Responsable: ${valueOrDash(lead.contactName)}`,
    `Email: ${valueOrDash(lead.email)}`,
    `Priorite: ${valueOrDash(lead.mainNeed)}`,
  ].join("\n");

  return { subject, text };
}

module.exports = {
  normalizeLeadPayload,
  getLeadStage,
  buildLeadEmail,
};
