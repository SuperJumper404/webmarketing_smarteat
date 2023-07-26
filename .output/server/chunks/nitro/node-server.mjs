globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import 'node-fetch-native/polyfill';
import { Server as Server$1 } from 'node:http';
import { Server } from 'node:https';
import destr from 'destr';
import { defineEventHandler, handleCacheHeaders, createEvent, eventHandler, setHeaders, sendRedirect, proxyRequest, getRequestHeader, setResponseStatus, setResponseHeader, getRequestHeaders, createError, createApp, createRouter as createRouter$1, toNodeListener, fetchWithEvent, lazyEventHandler } from 'h3';
import { createFetch as createFetch$1, Headers } from 'ofetch';
import { createCall, createFetch } from 'unenv/runtime/fetch/index';
import { createHooks } from 'hookable';
import { snakeCase } from 'scule';
import { klona } from 'klona';
import defu, { defuFn } from 'defu';
import { hash } from 'ohash';
import { parseURL, withoutBase, joinURL, getQuery, withQuery, withLeadingSlash, withoutTrailingSlash } from 'ufo';
import { createStorage, prefixStorage } from 'unstorage';
import { toRouteMatcher, createRouter } from 'radix3';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'pathe';

const inlineAppConfig = {};



const appConfig = defuFn(inlineAppConfig);

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/_nuxt/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      }
    }
  },
  "public": {}
};
const ENV_PREFIX = "NITRO_";
const ENV_PREFIX_ALT = _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_";
const _sharedRuntimeConfig = _deepFreeze(
  _applyEnv(klona(_inlineRuntimeConfig))
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  _applyEnv(runtimeConfig);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _getEnv(key) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function _applyEnv(obj, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = _getEnv(subKey);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
      }
      _applyEnv(obj[key], subKey);
    } else {
      obj[key] = envValue ?? obj[key];
    }
  }
  return obj;
}
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

const _assets = {

};

function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0].replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "");
}

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

const storage = createStorage({});

storage.mount('/assets', assets$1);

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const defaultCacheOptions = {
  name: "_",
  base: "/cache",
  swr: true,
  maxAge: 1
};
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions, ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = hash([opts.integrity, fn, opts]);
  const validate = opts.validate || (() => true);
  async function get(key, resolver, shouldInvalidateCache) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    const entry = await useStorage().getItem(cacheKey) || {};
    const ttl = (opts.maxAge ?? opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || !validate(entry);
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry)) {
          useStorage().setItem(cacheKey, entry).catch((error) => console.error("[nitro] [cache]", error));
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (opts.swr && entry.value) {
      _resolvePromise.catch(console.error);
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = opts.shouldInvalidateCache?.(...args);
    const entry = await get(key, () => fn(...args), shouldInvalidateCache);
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
const cachedFunction = defineCachedFunction;
function getKey(...args) {
  return args.length > 0 ? hash(args, {}) : "";
}
function escapeKey(key) {
  return key.replace(/[^\dA-Za-z]/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions) {
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const key = await opts.getKey?.(event);
      if (key) {
        return escapeKey(key);
      }
      const url = event.node.req.originalUrl || event.node.req.url;
      const friendlyName = escapeKey(decodeURI(parseURL(url).pathname)).slice(
        0,
        16
      );
      const urlHash = hash(url);
      return `${friendlyName}.${urlHash}`;
    },
    validate: (entry) => {
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: [opts.integrity, handler]
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const reqProxy = cloneWithProxy(incomingEvent.node.req, { headers: {} });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            for (const header in headers2) {
              this.setHeader(header, headers2[header]);
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.context = incomingEvent.context;
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = headers.Etag || headers.etag || `W/"${hash(body)}"`;
      headers["last-modified"] = headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString();
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(event);
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      event.node.res.setHeader(name, response.headers[name]);
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler() {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      return sendRedirect(
        event,
        routeRules.redirect.to,
        routeRules.redirect.statusCode
      );
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: $fetch.raw,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    const path = new URL(event.node.req.url, "http://localhost").pathname;
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(path, useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

const plugins = [
  
];

function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function normalizeError(error) {
  const cwd = typeof process.cwd === "function" ? process.cwd() : "/";
  const stack = (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace("file://", "").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Not Found" : "");
  const message = error.message || error.toString();
  return {
    stack,
    statusCode,
    statusMessage,
    message
  };
}

const errorHandler = (async function errorhandler(error, event) {
  const { stack, statusCode, statusMessage, message } = normalizeError(error);
  const errorObject = {
    url: event.node.req.url,
    statusCode,
    statusMessage,
    message,
    stack: "",
    data: error.data
  };
  setResponseStatus(event, errorObject.statusCode !== 200 && errorObject.statusCode || 500, errorObject.statusMessage);
  if (error.unhandled || error.fatal) {
    const tags = [
      "[nuxt]",
      "[request error]",
      error.unhandled && "[unhandled]",
      error.fatal && "[fatal]",
      Number(errorObject.statusCode) !== 200 && `[${errorObject.statusCode}]`
    ].filter(Boolean).join(" ");
    console.error(tags, errorObject.message + "\n" + stack.map((l) => "  " + l.text).join("  \n"));
  }
  if (isJsonRequest(event)) {
    setResponseHeader(event, "Content-Type", "application/json");
    event.node.res.end(JSON.stringify(errorObject));
    return;
  }
  const isErrorPage = event.node.req.url?.startsWith("/__nuxt_error");
  const res = !isErrorPage ? await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig().app.baseURL, "/__nuxt_error"), errorObject), {
    headers: getRequestHeaders(event),
    redirect: "manual"
  }).catch(() => null) : null;
  if (!res) {
    const { template } = await import('../error-500.mjs');
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    event.node.res.end(template(errorObject));
    return;
  }
  for (const [header, value] of res.headers.entries()) {
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : void 0, res.statusText);
  event.node.res.end(await res.text());
});

const assets = {
  "/appscreen.svg": {
    "type": "image/svg+xml",
    "etag": "\"a97c8-7Lg6gh+fCeh6RMq1rC2nvhYKnzs\"",
    "mtime": "2023-06-24T17:53:08.446Z",
    "size": 694216,
    "path": "../public/appscreen.svg"
  },
  "/arrowleft.svg": {
    "type": "image/svg+xml",
    "etag": "\"eb-ZE8EEFEKREbAkf5SFZrmoXp+QcQ\"",
    "mtime": "2023-06-18T14:04:35.871Z",
    "size": 235,
    "path": "../public/arrowleft.svg"
  },
  "/cashregister.png": {
    "type": "image/png",
    "etag": "\"e263-4W3bo0kIFGKsKmVd9dovhXGsC2Q\"",
    "mtime": "2023-05-28T16:44:58.920Z",
    "size": 57955,
    "path": "../public/cashregister.png"
  },
  "/dashbord.svg": {
    "type": "image/svg+xml",
    "etag": "\"fa080-VRINPucK6TxleC32kdoHapm1Eds\"",
    "mtime": "2023-07-06T23:39:09.518Z",
    "size": 1024128,
    "path": "../public/dashbord.svg"
  },
  "/email_icon.svg": {
    "type": "image/svg+xml",
    "etag": "\"134-ywb8vF3ec5R2QIcta0rbXY4popc\"",
    "mtime": "2023-07-08T19:30:56.076Z",
    "size": 308,
    "path": "../public/email_icon.svg"
  },
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"10be-n8egyE9tcb7sKGr/pYCaQ4uWqxI\"",
    "mtime": "2023-05-16T17:07:02.000Z",
    "size": 4286,
    "path": "../public/favicon.ico"
  },
  "/groupImage.svg": {
    "type": "image/svg+xml",
    "etag": "\"108fdf-QS/JfA7RKvVUaWLpi3DaRt91qUM\"",
    "mtime": "2023-06-18T12:30:02.888Z",
    "size": 1085407,
    "path": "../public/groupImage.svg"
  },
  "/imggroupclean.jpg": {
    "type": "image/jpeg",
    "etag": "\"118e9-4Wk9Tj80cS2KfCsD/7BHpVVo+ko\"",
    "mtime": "2023-06-18T16:03:06.836Z",
    "size": 71913,
    "path": "../public/imggroupclean.jpg"
  },
  "/IMG_1145 (1).jpg": {
    "type": "image/jpeg",
    "etag": "\"7f930-6060gDk8rjOWkxcfuGTXIinRxDg\"",
    "mtime": "2023-05-27T21:29:21.709Z",
    "size": 522544,
    "path": "../public/IMG_1145 (1).jpg"
  },
  "/IMG_1146.jpg": {
    "type": "image/jpeg",
    "etag": "\"77a40-CtLQAAHh8YSwZMjGvR5u5Jjvh5M\"",
    "mtime": "2023-05-27T21:29:16.338Z",
    "size": 490048,
    "path": "../public/IMG_1146.jpg"
  },
  "/IMG_1151.jpg": {
    "type": "image/jpeg",
    "etag": "\"1f519-1ohVIAiPKEnce5zIgfgMiQjy7/U\"",
    "mtime": "2023-05-27T21:29:12.029Z",
    "size": 128281,
    "path": "../public/IMG_1151.jpg"
  },
  "/IMG_1153.jpg": {
    "type": "image/jpeg",
    "etag": "\"10524-m2Rtu+KDzHC8yu2453TWmJNgR9E\"",
    "mtime": "2023-05-27T21:29:08.825Z",
    "size": 66852,
    "path": "../public/IMG_1153.jpg"
  },
  "/IMG_1156.jpg": {
    "type": "image/jpeg",
    "etag": "\"4b405-NTEaNpVe9CQq6dzfamn0hjTb3VA\"",
    "mtime": "2023-05-27T21:29:02.774Z",
    "size": 308229,
    "path": "../public/IMG_1156.jpg"
  },
  "/IMG_1157.jpg": {
    "type": "image/jpeg",
    "etag": "\"5914a-TLVROD970/haZk15Xoy/p0l0tCQ\"",
    "mtime": "2023-05-27T21:28:59.994Z",
    "size": 364874,
    "path": "../public/IMG_1157.jpg"
  },
  "/IMG_1162.jpg": {
    "type": "image/jpeg",
    "etag": "\"21027-h2cfqqGjG0bK3/F3ymEbgjAtHfI\"",
    "mtime": "2023-05-27T21:28:50.499Z",
    "size": 135207,
    "path": "../public/IMG_1162.jpg"
  },
  "/IMG_1163.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d9f2-f37rMCFQwg6EK3dxBa9uMIM3Azs\"",
    "mtime": "2023-05-27T21:28:43.848Z",
    "size": 121330,
    "path": "../public/IMG_1163.jpg"
  },
  "/IMG_1165.jpg": {
    "type": "image/jpeg",
    "etag": "\"4e14a-aF1zphbNk1CcPQ3Hsz+ZdLJvijc\"",
    "mtime": "2023-05-27T21:28:38.972Z",
    "size": 319818,
    "path": "../public/IMG_1165.jpg"
  },
  "/IMG_4067.PNG": {
    "type": "image/png",
    "etag": "\"13cada-Fr1WoJm5t9QQxRaL4fuREJz6S+M\"",
    "mtime": "2023-05-28T16:57:10.601Z",
    "size": 1297114,
    "path": "../public/IMG_4067.PNG"
  },
  "/IMG_4068.PNG": {
    "type": "image/png",
    "etag": "\"20aa80-4EK68l3JnNP2qbpZjK6Z6jGZpu4\"",
    "mtime": "2023-05-28T16:57:14.581Z",
    "size": 2140800,
    "path": "../public/IMG_4068.PNG"
  },
  "/IMG_4069.PNG": {
    "type": "image/png",
    "etag": "\"1754c3-kWCta1waMeyFC7dmeh9rACMXyy4\"",
    "mtime": "2023-05-28T16:57:17.160Z",
    "size": 1529027,
    "path": "../public/IMG_4069.PNG"
  },
  "/IMG_4070.PNG": {
    "type": "image/png",
    "etag": "\"50a26-SjwE/puy1no1BaSebvFt5EXQunY\"",
    "mtime": "2023-05-28T16:57:18.802Z",
    "size": 330278,
    "path": "../public/IMG_4070.PNG"
  },
  "/IMG_4071.PNG": {
    "type": "image/png",
    "etag": "\"5069b-8lvQ9UnArEbDXZF1h3GQ9o94IlE\"",
    "mtime": "2023-05-28T16:57:21.114Z",
    "size": 329371,
    "path": "../public/IMG_4071.PNG"
  },
  "/IMG_4072.PNG": {
    "type": "image/png",
    "etag": "\"1bbb0f-oe/X+IArrmpobnE0Cm5/A3GVHZM\"",
    "mtime": "2023-05-28T16:57:24.644Z",
    "size": 1817359,
    "path": "../public/IMG_4072.PNG"
  },
  "/IMG_4073.PNG": {
    "type": "image/png",
    "etag": "\"1e15dc-cYbso+3qAQrsEhNQv8wYXIbmJ0A\"",
    "mtime": "2023-05-28T16:57:27.428Z",
    "size": 1971676,
    "path": "../public/IMG_4073.PNG"
  },
  "/instagram_icon.svg": {
    "type": "image/svg+xml",
    "etag": "\"77fd-gWSVHQreZOLUBbiJGaQt98+j8EY\"",
    "mtime": "2023-07-08T19:55:06.222Z",
    "size": 30717,
    "path": "../public/instagram_icon.svg"
  },
  "/inventaire.svg": {
    "type": "image/svg+xml",
    "etag": "\"a3ed-+VLpFy2hxgf7kigVb6mAdrhP96I\"",
    "mtime": "2023-06-25T19:41:25.707Z",
    "size": 41965,
    "path": "../public/inventaire.svg"
  },
  "/menupersonnalisable.svg": {
    "type": "image/svg+xml",
    "etag": "\"159d8-PkVowPwpTs+2ABPwcAdMGucgkKg\"",
    "mtime": "2023-06-25T19:41:48.688Z",
    "size": 88536,
    "path": "../public/menupersonnalisable.svg"
  },
  "/OrderDetails.png": {
    "type": "image/png",
    "etag": "\"20002-+YwOQ22BnRtJlWBFQ8Sn6zZ5p1c\"",
    "mtime": "2023-05-28T16:35:57.871Z",
    "size": 131074,
    "path": "../public/OrderDetails.png"
  },
  "/Orders1.png": {
    "type": "image/png",
    "etag": "\"1edf4-m0rSTyoJ3KSItrLTHVr1vcIwjxw\"",
    "mtime": "2023-05-28T16:34:19.138Z",
    "size": 126452,
    "path": "../public/Orders1.png"
  },
  "/prisedecommande.svg": {
    "type": "image/svg+xml",
    "etag": "\"10a77-fTIhWqMQFrpI6IKq0E88E2TFTvQ\"",
    "mtime": "2023-06-25T19:40:59.200Z",
    "size": 68215,
    "path": "../public/prisedecommande.svg"
  },
  "/Produits.png": {
    "type": "image/png",
    "etag": "\"49f0b-OoQmbBigwgIYlSDPoTQhLLv9+NI\"",
    "mtime": "2023-05-28T16:37:59.898Z",
    "size": 302859,
    "path": "../public/Produits.png"
  },
  "/qrappmenu2.png": {
    "type": "image/png",
    "etag": "\"3250f-2oPx9p/fUHhNNGWojrs0UQOstic\"",
    "mtime": "2023-06-18T18:53:12.235Z",
    "size": 206095,
    "path": "../public/qrappmenu2.png"
  },
  "/robot_server.svg": {
    "type": "image/svg+xml",
    "etag": "\"4fbb-65/V6pXspnHGURT5irzQt8czzO8\"",
    "mtime": "2023-07-06T23:39:27.874Z",
    "size": 20411,
    "path": "../public/robot_server.svg"
  },
  "/table2.png": {
    "type": "image/png",
    "etag": "\"14ffe-aGoa1Z7UAO/RCmf4pYkovRUuO70\"",
    "mtime": "2023-05-28T16:32:27.174Z",
    "size": 86014,
    "path": "../public/table2.png"
  },
  "/tableplan.svg": {
    "type": "image/svg+xml",
    "etag": "\"27a3f-uqIe4UmhBjZFPbFCZ7vNBCC0FpY\"",
    "mtime": "2023-07-06T23:33:08.410Z",
    "size": 162367,
    "path": "../public/tableplan.svg"
  },
  "/tables.png": {
    "type": "image/png",
    "etag": "\"14d23-+PWZDTpNIjxOgXovIuZvLWwanUg\"",
    "mtime": "2023-05-28T16:31:26.967Z",
    "size": 85283,
    "path": "../public/tables.png"
  },
  "/whatapp_icon.svg": {
    "type": "image/svg+xml",
    "etag": "\"2eef-X9NkKL/KfJm+RJy44XfHNjew9hQ\"",
    "mtime": "2023-07-08T19:31:36.343Z",
    "size": 12015,
    "path": "../public/whatapp_icon.svg"
  },
  "/_nuxt/appscreen.7b7b6f52.svg": {
    "type": "image/svg+xml",
    "etag": "\"a97c8-7Lg6gh+fCeh6RMq1rC2nvhYKnzs\"",
    "mtime": "2023-07-10T16:54:01.360Z",
    "size": 694216,
    "path": "../public/_nuxt/appscreen.7b7b6f52.svg"
  },
  "/_nuxt/arrowleft.dbdf85ca.svg": {
    "type": "image/svg+xml",
    "etag": "\"eb-ZE8EEFEKREbAkf5SFZrmoXp+QcQ\"",
    "mtime": "2023-07-10T16:54:01.360Z",
    "size": 235,
    "path": "../public/_nuxt/arrowleft.dbdf85ca.svg"
  },
  "/_nuxt/entry.3d48e77f.js": {
    "type": "application/javascript",
    "etag": "\"8340f-0f0mOsm0KGU+bSjTz2XebFHZDvg\"",
    "mtime": "2023-07-10T16:54:01.360Z",
    "size": 537615,
    "path": "../public/_nuxt/entry.3d48e77f.js"
  },
  "/_nuxt/entry.78622ad2.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"b115-mjdyqK0xp9JkLOjvU1GPV1D0+yk\"",
    "mtime": "2023-07-10T16:54:01.360Z",
    "size": 45333,
    "path": "../public/_nuxt/entry.78622ad2.css"
  },
  "/_nuxt/error-404.8bdbaeb8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e70-jl7r/kE1FF0H+CLPNh+07RJXuFI\"",
    "mtime": "2023-07-10T16:54:01.360Z",
    "size": 3696,
    "path": "../public/_nuxt/error-404.8bdbaeb8.css"
  },
  "/_nuxt/error-404.caf45985.js": {
    "type": "application/javascript",
    "etag": "\"1997-FR6h0OEqto4f/Lpf6BcLJGOs34w\"",
    "mtime": "2023-07-10T16:54:01.356Z",
    "size": 6551,
    "path": "../public/_nuxt/error-404.caf45985.js"
  },
  "/_nuxt/error-500.4976fefe.js": {
    "type": "application/javascript",
    "etag": "\"78b-7yc1wgYZjRBsOfJC6zLT4toOWJA\"",
    "mtime": "2023-07-10T16:54:01.361Z",
    "size": 1931,
    "path": "../public/_nuxt/error-500.4976fefe.js"
  },
  "/_nuxt/error-500.b63a96f5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7e0-loEWA9n4Kq4UMBzJyT6hY9SSl00\"",
    "mtime": "2023-07-10T16:54:01.360Z",
    "size": 2016,
    "path": "../public/_nuxt/error-500.b63a96f5.css"
  },
  "/_nuxt/error-component.0a6fce5a.js": {
    "type": "application/javascript",
    "etag": "\"4b2-tCi4dFCY0m009CT9sCrEc+Ey4Ss\"",
    "mtime": "2023-07-10T16:54:01.361Z",
    "size": 1202,
    "path": "../public/_nuxt/error-component.0a6fce5a.js"
  },
  "/_nuxt/imggroupclean.e5331768.jpg": {
    "type": "image/jpeg",
    "etag": "\"118e9-4Wk9Tj80cS2KfCsD/7BHpVVo+ko\"",
    "mtime": "2023-07-10T16:54:01.360Z",
    "size": 71913,
    "path": "../public/_nuxt/imggroupclean.e5331768.jpg"
  },
  "/_nuxt/qrappmenu2.f473b4ef.png": {
    "type": "image/png",
    "etag": "\"3250f-2oPx9p/fUHhNNGWojrs0UQOstic\"",
    "mtime": "2023-07-10T16:54:01.360Z",
    "size": 206095,
    "path": "../public/_nuxt/qrappmenu2.f473b4ef.png"
  },
  "/_nuxt/_plugin-vue_export-helper.c27b6911.js": {
    "type": "application/javascript",
    "etag": "\"5b-eFCz/UrraTh721pgAl0VxBNR1es\"",
    "mtime": "2023-07-10T16:54:01.361Z",
    "size": 91,
    "path": "../public/_nuxt/_plugin-vue_export-helper.c27b6911.js"
  },
  "/lottie/system-outline-117-bolt.json": {
    "type": "application/json",
    "etag": "\"7669-rF3uerLY1nGLwl5cs+rPLM7kshk\"",
    "mtime": "2023-07-09T10:38:26.848Z",
    "size": 30313,
    "path": "../public/lottie/system-outline-117-bolt.json"
  },
  "/lottie/system-solid-117-bolt.json": {
    "type": "application/json",
    "etag": "\"72f1-EksBr2ChqItEu5tHHsVshsE2kNg\"",
    "mtime": "2023-07-09T19:49:12.850Z",
    "size": 29425,
    "path": "../public/lottie/system-solid-117-bolt.json"
  },
  "/lottie/system-solid-14-article.json": {
    "type": "application/json",
    "etag": "\"1579f-mm9c1gyjDPqZBmEPf9wt0xiV8o8\"",
    "mtime": "2023-07-10T06:30:39.417Z",
    "size": 87967,
    "path": "../public/lottie/system-solid-14-article.json"
  },
  "/lottie/system-solid-141-history.json": {
    "type": "application/json",
    "etag": "\"b836-m1OYOezyxJYkUPk3fqNtlP21OoM\"",
    "mtime": "2023-07-09T19:36:24.913Z",
    "size": 47158,
    "path": "../public/lottie/system-solid-141-history.json"
  },
  "/lottie/system-solid-160-trending-up.json": {
    "type": "application/json",
    "etag": "\"8951-AUJ7q2bglDtInTDhK3sanrF/Mqk\"",
    "mtime": "2023-07-09T19:41:33.783Z",
    "size": 35153,
    "path": "../public/lottie/system-solid-160-trending-up.json"
  },
  "/lottie/system-solid-197-calculate.json": {
    "type": "application/json",
    "etag": "\"f16d-kS1nL4GITy/AYtKTs3n5v7MLxJw\"",
    "mtime": "2023-07-10T06:28:43.358Z",
    "size": 61805,
    "path": "../public/lottie/system-solid-197-calculate.json"
  },
  "/lottie/system-solid-34-code.json": {
    "type": "application/json",
    "etag": "\"98ce-YldDKu23/Xb8Okzuvo2hHAtx0eM\"",
    "mtime": "2023-07-09T19:46:10.560Z",
    "size": 39118,
    "path": "../public/lottie/system-solid-34-code.json"
  },
  "/lottie/system-solid-43-pie-chart-diagram.json": {
    "type": "application/json",
    "etag": "\"7d4e-71riMElfvcd+2g4HC3OpZ9Z6Mfk\"",
    "mtime": "2023-07-10T06:31:16.967Z",
    "size": 32078,
    "path": "../public/lottie/system-solid-43-pie-chart-diagram.json"
  },
  "/lottie/system-solid-45-category.json": {
    "type": "application/json",
    "etag": "\"d0c2-O5RKrsFvNk9hqjfDAaew779lQp8\"",
    "mtime": "2023-07-09T19:47:36.125Z",
    "size": 53442,
    "path": "../public/lottie/system-solid-45-category.json"
  },
  "/lottie/system-solid-47-chat.json": {
    "type": "application/json",
    "etag": "\"bddd-W48n+NYTqV0OnCIF/v5fDGzR+3A\"",
    "mtime": "2023-07-09T19:38:02.620Z",
    "size": 48605,
    "path": "../public/lottie/system-solid-47-chat.json"
  },
  "/lottie/system-solid-58-call-phone.json": {
    "type": "application/json",
    "etag": "\"1331a-/LFWA95oKXZWXLWLfDfZM7o1DxI\"",
    "mtime": "2023-07-09T19:35:36.264Z",
    "size": 78618,
    "path": "../public/lottie/system-solid-58-call-phone.json"
  }
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt":{"maxAge":31536000}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _f4b49z = eventHandler((event) => {
  if (event.node.req.method && !METHODS.has(event.node.req.method)) {
    return;
  }
  let id = decodeURIComponent(
    withLeadingSlash(
      withoutTrailingSlash(parseURL(event.node.req.url).pathname)
    )
  );
  let asset;
  const encodingHeader = String(
    event.node.req.headers["accept-encoding"] || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  if (encodings.length > 1) {
    event.node.res.setHeader("Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      event.node.res.removeHeader("cache-control");
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = event.node.req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    event.node.res.statusCode = 304;
    event.node.res.end();
    return;
  }
  const ifModifiedSinceH = event.node.req.headers["if-modified-since"];
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    event.node.res.statusCode = 304;
    event.node.res.end();
    return;
  }
  if (asset.type && !event.node.res.getHeader("Content-Type")) {
    event.node.res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag && !event.node.res.getHeader("ETag")) {
    event.node.res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime && !event.node.res.getHeader("Last-Modified")) {
    event.node.res.setHeader("Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !event.node.res.getHeader("Content-Encoding")) {
    event.node.res.setHeader("Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !event.node.res.getHeader("Content-Length")) {
    event.node.res.setHeader("Content-Length", asset.size);
  }
  return readAsset(id);
});

const _lazy_oyRdw4 = () => import('../handlers/renderer.mjs');

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_oyRdw4, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_oyRdw4, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const h3App = createApp({
    debug: destr(false),
    onError: errorHandler
  });
  const router = createRouter$1();
  h3App.use(createRouteRulesHandler());
  const localCall = createCall(toNodeListener(h3App));
  const localFetch = createFetch(localCall, globalThis.fetch);
  const $fetch = createFetch$1({
    fetch: localFetch,
    Headers,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(
    eventHandler((event) => {
      event.context.nitro = event.context.nitro || {};
      const envContext = event.node.req.__unenv__;
      if (envContext) {
        Object.assign(event.context, envContext);
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: $fetch });
    })
  );
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch
  };
  for (const plugin of plugins) {
    plugin(app);
  }
  return app;
}
const nitroApp = createNitroApp();
const useNitroApp = () => nitroApp;

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const s = server.listen(port, host, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const i = s.address();
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${i.family === "IPv6" ? `[${i.address}]` : i.address}:${i.port}${baseURL}`;
  console.log(`Listening ${url}`);
});
{
  process.on(
    "unhandledRejection",
    (err) => console.error("[nitro] [dev] [unhandledRejection] " + err)
  );
  process.on(
    "uncaughtException",
    (err) => console.error("[nitro] [dev] [uncaughtException] " + err)
  );
}
const nodeServer = {};

export { useRuntimeConfig as a, getRouteRules as g, nodeServer as n, useNitroApp as u };
//# sourceMappingURL=node-server.mjs.map
