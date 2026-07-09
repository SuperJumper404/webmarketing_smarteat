type LeadRecord = {
  lead_id?: string;
  intent?: string;
  step?: number;
  restaurant_name?: string;
  phone?: string;
  city?: string;
  restaurant_type?: string;
  tables_count?: string;
  current_menu_source?: string;
  contact_name?: string;
  email?: string;
  main_need?: string;
};

type DatabaseWebhookPayload = {
  type?: string;
  table?: string;
  record?: LeadRecord;
};

function valueOrDash(value: unknown) {
  if (typeof value !== "string") return "-";
  return value.trim() || "-";
}

function buildDiscordMessage(lead: LeadRecord) {
  return [
    "**Nouveau lead SmartEat**",
    "",
    `Restaurant: ${valueOrDash(lead.restaurant_name)}`,
    `Téléphone: ${valueOrDash(lead.phone)}`,
    `Ville: ${valueOrDash(lead.city)}`,
    `Type: ${valueOrDash(lead.restaurant_type)}`,
    `Intention: ${valueOrDash(lead.intent)}`,
    `Étape: ${lead.step || 1}`,
    `Tables: ${valueOrDash(lead.tables_count)}`,
    `Menu actuel: ${valueOrDash(lead.current_menu_source)}`,
    `Contact: ${valueOrDash(lead.contact_name)}`,
    `Email: ${valueOrDash(lead.email)}`,
    `Priorite: ${valueOrDash(lead.main_need)}`,
  ].join("\n");
}

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ message: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const discordWebhookUrl = Deno.env.get("DISCORD_LEAD_WEBHOOK_URL");

  if (!discordWebhookUrl) {
    return new Response(JSON.stringify({ message: "Missing Discord webhook URL" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const payload = (await request.json()) as DatabaseWebhookPayload;
  const lead = payload.record || {};

  await fetch(discordWebhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: buildDiscordMessage(lead),
    }),
  });

  return new Response(JSON.stringify({ message: "Lead notification sent" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
