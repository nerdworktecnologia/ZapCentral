const EVOLUTION_URL = (import.meta.env.VITE_EVOLUTION_URL as string) ?? "https://evolution.ieneassessoria.com.br";
const EVOLUTION_API_KEY = (import.meta.env.VITE_EVOLUTION_API_KEY as string) ?? "";
const EVOLUTION_INSTANCE = (import.meta.env.VITE_EVOLUTION_INSTANCE as string) ?? "";

export type EvolutionStatus = "idle" | "connecting" | "connected" | "error";

export type EvolutionConnectionResult = {
  status: Exclude<EvolutionStatus, "idle">;
  instanceName?: string;
  error?: string;
};

function mapState(state: string): Exclude<EvolutionStatus, "idle"> {
  if (state === "open") return "connected";
  if (state === "connecting") return "connecting";
  return "error";
}

function authHeaders(apiKey: string) {
  return {
    apikey: apiKey,
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
}

async function fetchAllInstances(url: string, apiKey: string): Promise<EvolutionConnectionResult> {
  const res = await fetch(`${url}/instance/fetchInstances`, {
    headers: authHeaders(apiKey),
  });
  if (!res.ok) {
    if (res.status === 401) {
      return { status: "error", error: "Não autorizado (401) — verifique a API Key ou as configurações de CORS do servidor." };
    }
    return { status: "error", error: `HTTP ${res.status}: ${res.statusText}` };
  }
  const data = await res.json();
  const instances: unknown[] = Array.isArray(data) ? data : [];
  if (instances.length === 0) {
    return { status: "error", error: "Nenhuma instância encontrada na API." };
  }
  const inst = instances[0] as Record<string, unknown>;
  const state =
    (inst.connectionStatus as string) ??
    ((inst.instance as Record<string, unknown>)?.state as string) ??
    "";
  const name =
    ((inst.instance as Record<string, unknown>)?.instanceName as string) ??
    (inst.name as string) ??
    undefined;
  const status = mapState(state);
  return {
    status,
    instanceName: name,
    error: status === "error" ? `Estado: ${state || "desconhecido"}` : undefined,
  };
}

export async function checkEvolutionConnection(
  url = EVOLUTION_URL,
  apiKey = EVOLUTION_API_KEY,
  instance = EVOLUTION_INSTANCE,
): Promise<EvolutionConnectionResult> {
  try {
    // Try specific instance endpoint first (if instance name is configured)
    if (instance) {
      const res = await fetch(`${url}/instance/connectionState/${instance}`, {
        headers: authHeaders(apiKey),
      });
      // 404 = instance name not found, fall back to listing all instances
      if (res.status === 404) {
        return fetchAllInstances(url, apiKey);
      }
      if (!res.ok) {
        return { status: "error", error: `HTTP ${res.status}: ${res.statusText}` };
      }
      const data = (await res.json()) as Record<string, unknown>;
      const inst = (data.instance as Record<string, unknown>) ?? {};
      const state = (inst.state as string) ?? (data.state as string) ?? "";
      const name = (inst.instanceName as string) ?? instance;
      const status = mapState(state);
      return {
        status,
        instanceName: name,
        error: status === "error" ? `Estado: ${state || "desconhecido"}` : undefined,
      };
    }

    // No instance configured — fetch all
    return fetchAllInstances(url, apiKey);
  } catch (err) {
    return {
      status: "error",
      error: err instanceof Error ? err.message : "Erro desconhecido.",
    };
  }
}

export { EVOLUTION_URL, EVOLUTION_API_KEY, EVOLUTION_INSTANCE };
