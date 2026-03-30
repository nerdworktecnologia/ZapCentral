export const config = { runtime: "nodejs20.x" };

const CW_URL = process.env.VITE_CHATWOOT_URL || "https://chat.ieneassessoria.com.br";
const CW_TOKEN = process.env.VITE_CHATWOOT_TOKEN || "";
const CW_ACCOUNT = process.env.VITE_CHATWOOT_ACCOUNT || "1";

export default async function handler(req, res) {
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
  const upstreamUrl = `${CW_URL}/api/v1/accounts/${CW_ACCOUNT}/${pathStr}${qs ? `?${qs}` : ""}`;

  const bodyStr =
    req.method !== "GET" && req.method !== "HEAD" && req.body
      ? JSON.stringify(req.body)
      : undefined;

  const upstream = await fetch(upstreamUrl, {
    method: req.method,
    headers: {
      api_access_token: CW_TOKEN,
      "Content-Type": "application/json",
    },
    body: bodyStr,
  });

  const text = await upstream.text();
  res.status(upstream.status);
  try {
    res.json(JSON.parse(text));
  } catch {
    res.send(text);
  }
}
