const LEAD_FIELDS = {
  leadId: "lead_id",
  intent: "intent",
  restaurantName: "restaurant_name",
  phone: "phone",
  city: "city",
  restaurantType: "restaurant_type",
  tablesCount: "tables_count",
  currentMenuSource: "current_menu_source",
  contactName: "contact_name",
  email: "email",
  mainNeed: "main_need",
};

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeStep(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.trunc(parsed) : 1;
}

export function buildLeadRecord(lead = {}) {
  const record = {};

  for (const [source, target] of Object.entries(LEAD_FIELDS)) {
    record[target] = cleanString(lead[source]);
  }

  record.intent = record.intent === "account" ? "account" : "demo";
  record.step = normalizeStep(lead.step);

  return record;
}

function cleanSupabaseUrl(value) {
  return cleanString(value).replace(/\/+$/, "");
}

export function buildSupabaseLeadRequest({ supabaseUrl, supabaseAnonKey, lead }) {
  const url = cleanSupabaseUrl(supabaseUrl);
  const anonKey = cleanString(supabaseAnonKey);

  if (!url || !anonKey) {
    throw new Error("Missing Supabase configuration");
  }

  return {
    url: `${url}/rest/v1/leads?on_conflict=lead_id`,
    options: {
      method: "POST",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: buildLeadRecord(lead),
    },
  };
}
