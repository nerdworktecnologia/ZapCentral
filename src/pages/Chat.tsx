import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Send, Search, MessageSquare, ExternalLink, CheckCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { chatwoot, type CWConversation } from "@/lib/chatwoot";

const CW_URL = import.meta.env.VITE_CHATWOOT_URL as string;
const CW_ACCOUNT = import.meta.env.VITE_CHATWOOT_ACCOUNT as string;

const statusLabel: Record<string, string> = {
  open: "Aberta",
  resolved: "Resolvida",
  pending: "Pendente",
  snoozed: "Adiada",
};

const statusColor: Record<string, string> = {
  open: "bg-green-500/10 text-green-600 border-green-500/20",
  resolved: "bg-muted text-muted-foreground",
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  snoozed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function formatTime(ts: number) {
  return new Date(ts * 1000).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(ts: number) {
  return new Date(ts * 1000).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

export default function Chat() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [status, setStatus] = useState<"open" | "resolved" | "pending">("open");

  const { data: convData, isLoading } = useQuery({
    queryKey: ["cw-conversations", status],
    queryFn: () => chatwoot.getConversations(1, status),
    refetchInterval: 20_000,
  });

  const conversations = convData?.conversations ?? [];

  const filtered = conversations.filter((c) =>
    c.meta.sender.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.meta.sender.phone_number ?? "").includes(search)
  );

  const selected = conversations.find((c) => c.id === selectedId) ?? filtered[0] ?? null;

  const { data: messages = [] } = useQuery({
    queryKey: ["cw-messages", selected?.id],
    queryFn: () => chatwoot.getConversationMessages(selected!.id),
    enabled: !!selected,
    refetchInterval: 10_000,
  });

  const sortedMessages = [...messages].sort((a, b) => a.created_at - b.created_at);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] pb-16 md:pb-0">
      {/* Sidebar */}
      <div className="w-80 border-r flex flex-col bg-card shrink-0">
        <div className="p-3 border-b space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar conversas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
          <div className="flex gap-1">
            {(["open", "pending", "resolved"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`flex-1 rounded-lg py-1 text-xs font-medium transition-colors ${
                  status === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {statusLabel[s]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {isLoading ? (
            <div className="p-3 space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Nenhuma conversa {statusLabel[status].toLowerCase()}.
            </div>
          ) : (
            filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full flex items-start gap-3 p-3 text-left hover:bg-muted/50 transition-colors border-b border-border/50 ${
                  selected?.id === c.id ? "bg-primary/5" : ""
                }`}
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                    {initials(c.meta.sender.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-medium text-sm truncate">{c.meta.sender.name}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">{formatDate(c.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Badge variant="outline" className={`text-[9px] px-1 py-0 ${statusColor[c.status]}`}>
                      {statusLabel[c.status]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">#{c.id}</span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Área de mensagens */}
      {selected ? (
        <div className="flex-1 flex flex-col min-w-0">
          <div className="h-14 px-4 flex items-center justify-between gap-3 border-b bg-card/50">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {initials(selected.meta.sender.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-sm">{selected.meta.sender.name}</div>
                <div className="text-xs text-muted-foreground">
                  Conversa #{selected.id} · {statusLabel[selected.status]}
                </div>
              </div>
            </div>
            <a
              href={`${CW_URL}/app/accounts/${CW_ACCOUNT}/conversations/${selected.id}`}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Abrir no Chatwoot"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
            {sortedMessages.map((msg) => {
              const isIncoming = msg.message_type === 0;
              return (
                <div key={msg.id} className={`flex ${isIncoming ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                    isIncoming
                      ? "bg-muted text-foreground rounded-bl-md"
                      : "bg-primary text-primary-foreground rounded-br-md"
                  }`}>
                    {!isIncoming && msg.sender?.name && (
                      <div className="text-[10px] text-primary-foreground/70 font-medium mb-1">
                        {msg.sender.name}
                      </div>
                    )}
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                      isIncoming ? "text-muted-foreground" : "text-primary-foreground/70"
                    }`}>
                      {formatTime(msg.created_at)}
                      {!isIncoming && <CheckCheck className="h-3 w-3" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 border-t bg-card/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 rounded-xl px-4 py-3">
              <MessageSquare className="h-4 w-4 shrink-0" />
              <span>Responda diretamente pelo </span>
              <a
                href={`${CW_URL}/app/accounts/${CW_ACCOUNT}/conversations/${selected.id}`}
                target="_blank"
                rel="noreferrer"
                className="text-primary font-medium hover:underline"
              >
                Chatwoot
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Selecione uma conversa</p>
          </div>
        </div>
      )}
    </div>
  );
}
