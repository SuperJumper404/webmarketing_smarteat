const test = require("node:test");
const assert = require("node:assert/strict");
const Module = require("node:module");

const sendMailPath = require.resolve("./send-mail");

function withMockedMailer(run) {
  const originalLoad = Module._load;
  const calls = {
    createTransport: [],
    sendMail: [],
  };

  Module._load = function mockedLoad(request, parent, isMain) {
    if (request === "nodemailer") {
      return {
        createTransport(options) {
          calls.createTransport.push(options);
          return {
            async sendMail(message) {
              calls.sendMail.push(message);
            },
          };
        },
      };
    }

    return originalLoad.apply(this, arguments);
  };

  delete require.cache[sendMailPath];
  const handler = require("./send-mail").handler;

  return Promise.resolve()
    .then(() => run(handler, calls))
    .finally(() => {
      Module._load = originalLoad;
      delete require.cache[sendMailPath];
    });
}

function withEnv(env, run) {
  const previous = {
    EMAIL_USERNAME: process.env.EMAIL_USERNAME,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    LEAD_RECIPIENT_EMAIL: process.env.LEAD_RECIPIENT_EMAIL,
  };

  for (const key of Object.keys(previous)) {
    delete process.env[key];
  }

  Object.assign(process.env, env);

  return Promise.resolve()
    .then(run)
    .finally(() => {
      for (const key of Object.keys(previous)) {
        if (previous[key] === undefined) {
          delete process.env[key];
        } else {
          process.env[key] = previous[key];
        }
      }
    });
}

test("malformed JSON returns 400 and does not send email", async () => {
  await withEnv(
    {
      EMAIL_USERNAME: "smtp@example.com",
      EMAIL_PASSWORD: "secret",
    },
    () =>
      withMockedMailer(async (handler, calls) => {
        const result = await handler({
          httpMethod: "POST",
          body: "{bad json",
        });

        assert.equal(result.statusCode, 400);
        assert.deepEqual(JSON.parse(result.body), {
          message: "Requete invalide.",
        });
        assert.equal(calls.createTransport.length, 0);
        assert.equal(calls.sendMail.length, 0);
      })
  );
});

test("empty parsed JSON returns 400 and does not send email", async () => {
  await withEnv(
    {
      EMAIL_USERNAME: "smtp@example.com",
      EMAIL_PASSWORD: "secret",
    },
    () =>
      withMockedMailer(async (handler, calls) => {
        const result = await handler({
          httpMethod: "POST",
          body: JSON.stringify({}),
        });

        assert.equal(result.statusCode, 400);
        assert.deepEqual(JSON.parse(result.body), {
          message: "Requete invalide.",
        });
        assert.equal(calls.createTransport.length, 0);
        assert.equal(calls.sendMail.length, 0);
      })
  );
});

test("null JSON returns 400 and does not send email", async () => {
  await withEnv(
    {
      EMAIL_USERNAME: "smtp@example.com",
      EMAIL_PASSWORD: "secret",
    },
    () =>
      withMockedMailer(async (handler, calls) => {
        const result = await handler({
          httpMethod: "POST",
          body: "null",
        });

        assert.equal(result.statusCode, 400);
        assert.deepEqual(JSON.parse(result.body), {
          message: "Requete invalide.",
        });
        assert.equal(calls.createTransport.length, 0);
        assert.equal(calls.sendMail.length, 0);
      })
  );
});

test("missing SMTP environment returns 500 before creating transporter", async () => {
  await withEnv({}, () =>
    withMockedMailer(async (handler, calls) => {
      const originalError = console.error;
      console.error = () => {};

      try {
        const result = await handler({
          httpMethod: "POST",
          body: JSON.stringify({ restaurantName: "Maison Test" }),
        });

        assert.equal(result.statusCode, 500);
        assert.deepEqual(JSON.parse(result.body), {
          message: "Une erreur est survenue lors de l'enregistrement du lead.",
        });
        assert.equal(calls.createTransport.length, 0);
        assert.equal(calls.sendMail.length, 0);
      } finally {
        console.error = originalError;
      }
    })
  );
});

test("non-POST requests return 405 with Allow header", async () => {
  await withMockedMailer(async (handler, calls) => {
    const result = await handler({
      httpMethod: "GET",
      body: "",
    });

    assert.equal(result.statusCode, 405);
    assert.deepEqual(result.headers, { Allow: "POST" });
    assert.equal(calls.createTransport.length, 0);
    assert.equal(calls.sendMail.length, 0);
  });
});
