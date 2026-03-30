const CW_URL = (import.meta.env.VITE_CHATWOOT_URL as string) ?? "https://chat.ieneassessoria.com.br";
const CW_TOKEN = (import.meta.env.VITE_CHATWOOT_TOKEN as string) ?? "ZtgDLEF4TtVzqX1R55TcGSC2";
const CW_ACCOUNT = (import.meta.env.VITE_CHATWOOT_ACCOUNT as string) ?? "1";

// Use serverless proxy in production to avoid CORS; direct in dev
const USE_PROXY = typeof window !== "undefined" && !window.location.hostname.includes("localhost");

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let url: string;
  let fetchOptions: RequestInit;

  if (USE_PROXY) {
    // Strip leading slash and pass as query param to /api/chatwoot
    const stripped = path.replace(/^\//, "");
    const [base, qs] = stripped.split("?");
    const params = new URLSearchParams(qs ?? "");
    params.set("path", base);
    url = `/api/chatwoot?${params.toString()}`;
    fetchOptions = { ...options, headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) } };
  } else {
    url = `${CW_URL}/api/v1/accounts/${CW_ACCOUNT}${path}`;
    fetchOptions = { headers: { api_access_token: CW_TOKEN }, ...options };
  }

  const res = await fetch(url, fetchOptions);
  if (!res.ok) throw new Error(`Chatwoot API error: ${res.status}`);
  return res.json();
}

export type CWContact = {
  id: number;
  name: string;
  phone_number: string | null;
  email: string | null;
  created_at: string;
  last_activity_at: string | null;
};

export type CWConversation = {
  id: number;
  status: "open" | "resolved" | "pending" | "snoozed";
  created_at: number;
  updated_at: string;
  inbox_id: number;
  meta: {
    sender: { id: number; name: string; phone_number?: string };
    channel: string;
  };
  messages: CWMessage[];
};

export type CWMessage = {
  id: number;
  content: string;
  message_type: number; // 0=incoming, 1=outgoing
  created_at: number;
  sender?: { name: string };
};

export type CWReport = {
  account_conversations: number;
  open_conversations: number;
  resolved_conversations: number;
  resolutions_count: number;
  avg_first_response_time: number;
};

export const chatwoot = {
  async getContacts(page = 1, search = ""): Promise<{ contacts: CWContact[]; total: number }> {
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set("q", search);
    const data = await request<{ payload: CWContact[]; meta: { count: number } }>(
      `/contacts?${params}`,
    );
    return { contacts: data.payload, total: data.meta.count };
  },

  async getConversations(page = 1, status = "open"): Promise<{ conversations: CWConversation[]; total: number }> {
    const params = new URLSearchParams({ page: String(page), status });
    const data = await request<{ data: { payload: CWConversation[]; meta: { all_count: number } } }>(
      `/conversations?${params}`,
    );
    return { conversations: data.data.payload, total: data.data.meta.all_count };
  },

  async getConversationMessages(conversationId: number): Promise<CWMessage[]> {
    const data = await request<{ payload: CWMessage[] }>(
      `/conversations/${conversationId}/messages`,
    );
    return data.payload;
  },

  async getReports(): Promise<CWReport> {
    const data = await request<CWReport>(`/reports/summary`);
    return data;
  },

  async updateConversationStatus(id: number, status: "open" | "resolved" | "pending"): Promise<void> {
    await request(`/conversations/${id}/toggle_status`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  },

  async sendMessage(conversationId: number, content: string): Promise<CWMessage> {
    const data = await request<{ id: number; content: string; message_type: number; created_at: number; sender?: { name: string } }>(
      `/conversations/${conversationId}/messages`,
      {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ content, message_type: "outgoing", private: false }),
      },
    );
    return data as CWMessage;
  },
};
