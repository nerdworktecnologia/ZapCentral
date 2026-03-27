const N8N_URL = import.meta.env.VITE_N8N_URL as string;
const N8N_API_KEY = import.meta.env.VITE_N8N_API_KEY as string;

const headers = {
  "X-N8N-API-KEY": N8N_API_KEY,
  "Content-Type": "application/json",
};

export type N8nWorkflow = {
  id: string;
  name: string;
  active: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
};

export type N8nExecution = {
  id: string;
  finished: boolean;
  mode: string;
  startedAt: string;
  stoppedAt: string | null;
  workflowId: string;
  status: "success" | "error" | "running" | "waiting";
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${N8N_URL}/api/v1${path}`, { headers, ...options });
  if (!res.ok) throw new Error(`n8n API error: ${res.status}`);
  return res.json();
}

export const n8n = {
  async getWorkflows(): Promise<N8nWorkflow[]> {
    const data = await request<{ data: N8nWorkflow[] }>("/workflows?limit=100");
    return data.data.filter((w) => !w.isArchived);
  },

  async activateWorkflow(id: string): Promise<void> {
    await request(`/workflows/${id}/activate`, { method: "POST" });
  },

  async deactivateWorkflow(id: string): Promise<void> {
    await request(`/workflows/${id}/deactivate`, { method: "POST" });
  },

  async getExecutions(workflowId?: string, limit = 20): Promise<N8nExecution[]> {
    const params = new URLSearchParams({ limit: String(limit) });
    if (workflowId) params.set("workflowId", workflowId);
    const data = await request<{ data: N8nExecution[] }>(`/executions?${params}`);
    return data.data;
  },
};
