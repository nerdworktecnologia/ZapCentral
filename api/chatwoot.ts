import type { VercelRequest, VercelResponse } from "@vercel/node";

const CW_URL = process.env.VITE_CHATWOOT_URL ?? "https://chat.ieneassessoria.com.br";
const CW_TOKEN = process.env.VITE_CHATWOOT_TOKEN ?? "";
const CW_ACCOUNT = process.env.VITE_CHATWOOT_ACCOUNT ?? "1";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { path } = req.query;
  const pathStr = Array.isArray(path) ? path.join("/") : (path ?? "");

  // Forward query params except "path"
  const forwardParams = new URLSearchParams();
  for (const [k, v] of Object.entries(req.query)) {
    if (k === "path") continue;
    forwardParams.set(k, String(v));
  }
  const qs = forwardParams.toString();
  const url = `${CW_URL}/api/v1/accounts/${CW_ACCOUNT}/${pathStr}${qs ? `?${qs}` : ""}`;

  const upstream = await fetch(url, {
    method: req.method,
    headers: {
      api_access_token: CW_TOKEN,
      "Content-Type": "application/json",
    },
    body: req.method !== "GET" && req.method !== "HEAD" ? JSON.stringify(req.body) : undefined,
  });

  const text = await upstream.text();
  res.status(upstream.status);
  try {
    res.json(JSON.parse(text));
  } catch {
    res.send(text);
  }
}
