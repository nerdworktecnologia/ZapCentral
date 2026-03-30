const https = require("https");
const http = require("http");
const { URL } = require("url");

const CW_URL = process.env.VITE_CHATWOOT_URL || "https://chat.ieneassessoria.com.br";
const CW_TOKEN = process.env.VITE_CHATWOOT_TOKEN || "";
const CW_ACCOUNT = process.env.VITE_CHATWOOT_ACCOUNT || "1";

function doRequest(urlStr, method, headers, body) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(urlStr);
    const lib = parsed.protocol === "https:" ? https : http;
    const options = {
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === "https:" ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method,
      headers,
    };
    const req = lib.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ status: res.statusCode, body: data }));
    });
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { path, ...rest } = req.query;
  const pathStr = Array.isArray(path) ? path.join("/") : (path || "");

  const forwardParams = new URLSearchParams();
  for (const [k, v] of Object.entries(rest)) {
    forwardParams.set(k, String(v));
  }
  const qs = forwardParams.toString();
  const url = `${CW_URL}/api/v1/accounts/${CW_ACCOUNT}/${pathStr}${qs ? `?${qs}` : ""}`;

  try {
    const bodyStr =
      req.method !== "GET" && req.method !== "HEAD" && req.body
        ? JSON.stringify(req.body)
        : undefined;

    const { status, body } = await doRequest(
      url,
      req.method,
      {
        api_access_token: CW_TOKEN,
        "Content-Type": "application/json",
        ...(bodyStr ? { "Content-Length": Buffer.byteLength(bodyStr) } : {}),
      },
      bodyStr,
    );

    res.status(status);
    try {
      res.json(JSON.parse(body));
    } catch {
      res.send(body);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
