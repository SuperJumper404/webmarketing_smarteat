const nodemailer = require("nodemailer");
const {
  normalizeLeadPayload,
  getLeadStage,
  buildLeadEmail,
} = require("./lead-utils");

class InvalidRequestError extends Error {}
class ConfigurationError extends Error {}

function parseBody(event) {
  if (!event || !event.body) return {};
  if (typeof event.body === "object") return event.body;
  try {
    const parsed = JSON.parse(event.body);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new InvalidRequestError("JSON body must be an object");
    }
    return parsed;
  } catch {
    throw new InvalidRequestError("Malformed JSON body");
  }
}

function getMailConfig() {
  const from = process.env.EMAIL_USERNAME && process.env.EMAIL_USERNAME.trim();
  const password = process.env.EMAIL_PASSWORD;

  if (!from || !password || !password.trim()) {
    throw new ConfigurationError("Missing EMAIL_USERNAME or EMAIL_PASSWORD");
  }

  // LEAD_RECIPIENT_EMAIL receives the lead when configured, and the SMTP account receives a copy.
  const recipients = [
    (process.env.LEAD_RECIPIENT_EMAIL || "").trim() || from,
    from,
  ].filter(Boolean);

  const uniqueRecipients = [...new Set(recipients)];

  if (uniqueRecipients.length === 0) {
    throw new ConfigurationError("Missing lead email recipients");
  }

  return { from, password, recipients: uniqueRecipients };
}

exports.handler = async (event) => {
  if (event.httpMethod && event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { Allow: "POST" },
      body: JSON.stringify({ message: "Methode non autorisee." }),
    };
  }

  try {
    const payload = parseBody(event);
    const lead = normalizeLeadPayload(payload);

    if (getLeadStage(lead) === "empty") {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Requete invalide." }),
      };
    }

    const email = buildLeadEmail(lead);
    const mailConfig = getMailConfig();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: mailConfig.from,
        pass: mailConfig.password,
      },
    });

    await transporter.sendMail({
      from: mailConfig.from,
      to: mailConfig.recipients.join(","),
      subject: email.subject,
      text: email.text,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Lead SmartEat enregistre.",
        leadId: lead.leadId,
      }),
    };
  } catch (error) {
    if (error instanceof InvalidRequestError) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Requete invalide." }),
      };
    }

    if (error instanceof ConfigurationError) {
      console.error("SmartEat lead email configuration error", error.message);
    } else {
      console.error("SmartEat lead email error", error);
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Une erreur est survenue lors de l'enregistrement du lead.",
      }),
    };
  }
};
