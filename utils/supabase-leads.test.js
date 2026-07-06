const test = require("node:test");
const assert = require("node:assert/strict");

let buildLeadRecord;
let buildSupabaseLeadRequest;
let buildSupabaseLeadRequests;
let isSupabaseConflictError;

test.before(async () => {
  const supabaseLeads = await import("./supabase-leads.mjs");
  buildLeadRecord = supabaseLeads.buildLeadRecord;
  buildSupabaseLeadRequest = supabaseLeads.buildSupabaseLeadRequest;
  buildSupabaseLeadRequests = supabaseLeads.buildSupabaseLeadRequests;
  isSupabaseConflictError = supabaseLeads.isSupabaseConflictError;
});

test("builds a Supabase lead record from onboarding data", () => {
  const record = buildLeadRecord({
    leadId: " lead-123 ",
    intent: "account",
    step: 2,
    restaurantName: "  Le Bistrot  ",
    phone: " 0612345678 ",
    city: " Lyon ",
    restaurantType: "Restaurant",
    tablesCount: "24",
    currentMenuSource: "PDF",
    contactName: " Sarah ",
    email: " contact@example.com ",
    mainNeed: "Menu QR",
  });

  assert.deepEqual(record, {
    lead_id: "lead-123",
    intent: "account",
    step: 2,
    restaurant_name: "Le Bistrot",
    phone: "0612345678",
    city: "Lyon",
    restaurant_type: "Restaurant",
    tables_count: "24",
    current_menu_source: "PDF",
    contact_name: "Sarah",
    email: "contact@example.com",
    main_need: "Menu QR",
  });
});

test("builds a Supabase REST insert request", () => {
  const request = buildSupabaseLeadRequest({
    supabaseUrl: "https://example.supabase.co/",
    supabaseAnonKey: "anon-key",
    lead: {
      leadId: "lead-123",
      restaurantName: "Le Bistrot",
      intent: "demo",
      step: 1,
    },
  });

  assert.equal(request.url, "https://example.supabase.co/rest/v1/leads?on_conflict=lead_id");
  assert.deepEqual(request.options.headers, {
    apikey: "anon-key",
    Authorization: "Bearer anon-key",
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates,return=minimal",
  });
  assert.deepEqual(request.options.body, {
    lead_id: "lead-123",
    intent: "demo",
    step: 1,
    restaurant_name: "Le Bistrot",
    phone: "",
    city: "",
    restaurant_type: "",
    tables_count: "",
    current_menu_source: "",
    contact_name: "",
    email: "",
    main_need: "",
  });
});

test("builds Supabase REST insert and lead-scoped update requests", () => {
  const requests = buildSupabaseLeadRequests({
    supabaseUrl: "https://example.supabase.co/",
    supabaseAnonKey: "anon-key",
    lead: {
      leadId: " lead-123 ",
      restaurantName: "Le Bistrot",
      intent: "demo",
      step: 1,
    },
  });

  assert.equal(requests.insert.url, "https://example.supabase.co/rest/v1/leads");
  assert.equal(requests.insert.options.method, "POST");
  assert.equal(requests.insert.options.headers.Prefer, "return=minimal");
  assert.equal(requests.insert.options.headers["x-lead-id"], "lead-123");

  assert.equal(requests.update.url, "https://example.supabase.co/rest/v1/leads?lead_id=eq.lead-123");
  assert.equal(requests.update.options.method, "PATCH");
  assert.equal(requests.update.options.headers.Prefer, "return=minimal");
  assert.equal(requests.update.options.headers["x-lead-id"], "lead-123");
  assert.deepEqual(requests.update.options.body, requests.insert.options.body);
});

test("detects Supabase duplicate lead conflicts", () => {
  assert.equal(isSupabaseConflictError({ statusCode: 409 }), true);
  assert.equal(isSupabaseConflictError({ response: { status: 409 } }), true);
  assert.equal(isSupabaseConflictError({ statusCode: 401 }), false);
});

test("requires Supabase public configuration before building request", () => {
  assert.throws(
    () =>
      buildSupabaseLeadRequest({
        supabaseUrl: "",
        supabaseAnonKey: "",
        lead: { restaurantName: "Le Bistrot" },
      }),
    /Missing Supabase configuration/
  );
});
