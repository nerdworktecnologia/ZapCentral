import fetch from "node-fetch";

const N8N_URL = process.env.VITE_N8N_URL || "https://automacao.ieneassessoria.com.br";
const N8N_API_KEY = process.env.VITE_N8N_API_KEY || "";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const { path, ...rest } = req.query;
    const pathStr = Array.isArray(path) ? path.join("/") : (path || "");

    const forwardParams = new URLSearchParams();
    for (const [k, v] of Object.entries(rest)) {
      forwardParams.set(k, String(v));
    }
    const qs = forwardParams.toString();
    const upstreamUrl = `${N8N_URL}/api/v1/${pathStr}${qs ? `?${qs}` : ""}`;

    const bodyStr =
      req.method !== "GET" && req.method !== "HEAD" && req.body
        ? JSON.stringify(req.body)
        : undefined;

    const upstream = await fetch(upstreamUrl, {
      method: req.method,
      headers: {
        "X-N8N-API-KEY": N8N_API_KEY,
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
  } catch (err) {
    res.status(500).json({ error: String(err), stack: err.stack });
  }
}
