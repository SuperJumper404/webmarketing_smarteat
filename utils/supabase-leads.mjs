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

function buildHeaders(anonKey, leadId) {
  return {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
    "Content-Type": "application/json",
    Prefer: "return=minimal",
    "x-lead-id": leadId,
  };
}

function assertSupabaseConfig({ supabaseUrl, supabaseAnonKey }) {
  const url = cleanSupabaseUrl(supabaseUrl);
  const anonKey = cleanString(supabaseAnonKey);

  if (!url || !anonKey) {
    throw new Error("Missing Supabase configuration");
  }

  return { url, anonKey };
}

export function buildSupabaseLeadRequests({ supabaseUrl, supabaseAnonKey, lead }) {
  const { url, anonKey } = assertSupabaseConfig({ supabaseUrl, supabaseAnonKey });
  const body = buildLeadRecord(lead);
  const leadId = encodeURIComponent(body.lead_id);

  return {
    insert: {
      url: `${url}/rest/v1/leads`,
      options: {
        method: "POST",
        headers: buildHeaders(anonKey, body.lead_id),
        body,
      },
    },
    update: {
      url: `${url}/rest/v1/leads?lead_id=eq.${leadId}`,
      options: {
        method: "PATCH",
        headers: buildHeaders(anonKey, body.lead_id),
        body,
      },
    },
  };
}

export function isSupabaseConflictError(error) {
  return error?.statusCode === 409 || error?.status === 409 || error?.response?.status === 409;
}

export function buildSupabaseLeadRequest({ supabaseUrl, supabaseAnonKey, lead }) {
  const { url, anonKey } = assertSupabaseConfig({ supabaseUrl, supabaseAnonKey });

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
