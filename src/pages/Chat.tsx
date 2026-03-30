import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Send, Search, MessageSquare, CheckCheck, Plus, Loader2, Phone, User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: string;
};

type Conversation = {
  id: string;
  lead_id: string;
  channel: string;
  last_message: string;
  last_message_time: string;
  unread: number;
  updated_at: string;
  leads: Lead;
};

type Message = {
  id: string;
  conversation_id: string;
  lead_id: string;
  content: string;
  sender: "lead" | "agent" | "ai";
  created_at: string;
};

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return formatTime(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

const statusColor: Record<string, string> = {
  novo: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  atendimento: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  proposta: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  fechado: "bg-green-500/10 text-green-600 border-green-500/20",
};

export default function Chat() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [newContactOpen, setNewContactOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations with leads
  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select("*, leads(*)")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data as unknown as Conversation[];
    },
    refetchInterval: 10_000,
  });

  const filtered = conversations.filter((c) =>
    c.leads?.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.leads?.phone?.includes(search)
  );

  const selected = conversations.find((c) => c.id === selectedId) ?? filtered[0] ?? null;

  // Auto-select first conversation
  useEffect(() => {
    if (!selectedId && filtered.length > 0) setSelectedId(filtered[0].id);
  }, [conversations]);

  // Load messages for selected conversation
  const { data: messages = [], isLoading: loadingMessages } = useQuery({
    queryKey: ["messages", selected?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", selected!.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as Message[];
    },
    enabled: !!selected,
    refetchInterval: 5_000,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Send message
  const sendMutation = useMutation({
    mutationFn: async ({ convId, leadId, content }: { convId: string; leadId: string; content: string }) => {
      const now = new Date().toISOString();
      const { error: msgErr } = await supabase.from("messages").insert({
        conversation_id: convId,
        lead_id: leadId,
        content,
        sender: "agent",
        channel: "whatsapp",
        timestamp: formatTime(now),
      });
      if (msgErr) throw msgErr;
      const { error: convErr } = await supabase
        .from("conversations")
        .update({ last_message: content, last_message_time: formatTime(now), updated_at: now })
        .eq("id", convId);
      if (convErr) throw convErr;
    },
    onSuccess: () => {
      setMessage("");
      qc.invalidateQueries({ queryKey: ["messages", selected?.id] });
      qc.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: () => toast({ title: "Erro ao enviar mensagem.", variant: "destructive" }),
  });

  // Create new contact + conversation
  const createMutation = useMutation({
    mutationFn: async () => {
      const { data: lead, error: leadErr } = await supabase
        .from("leads")
        .insert({ name: newName, phone: newPhone, email: newEmail || `${newPhone}@demo.com`, status: "atendimento", tag: "quente", value: 0 })
        .select()
        .single();
      if (leadErr) throw leadErr;

      const { data: conv, error: convErr } = await supabase
        .from("conversations")
        .insert({ lead_id: lead.id, channel: "whatsapp", last_message: "", last_message_time: "", unread: 0 })
        .select()
        .single();
      if (convErr) throw convErr;
      return conv;
    },
    onSuccess: (conv) => {
      setNewName(""); setNewPhone(""); setNewEmail("");
      setNewContactOpen(false);
      qc.invalidateQueries({ queryKey: ["conversations"] });
      setSelectedId(conv.id);
      toast({ title: "Contato criado!" });
    },
    onError: () => toast({ title: "Erro ao criar contato.", variant: "destructive" }),
  });

  function handleSend() {
    const text = message.trim();
    if (!text || !selected) return;
    sendMutation.mutate({ convId: selected.id, leadId: selected.lead_id, content: text });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] pb-16 md:pb-0">
      {/* Sidebar */}
      <div className="w-80 border-r flex flex-col bg-card shrink-0">
        <div className="p-3 border-b space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar conversas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
            <Button size="icon" className="h-9 w-9 shrink-0" onClick={() => setNewContactOpen(true)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-3 space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-center space-y-3">
              <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">Nenhuma conversa ainda.</p>
              <Button size="sm" onClick={() => setNewContactOpen(true)}>
                <Plus className="h-4 w-4 mr-1.5" /> Novo contato
              </Button>
            </div>
          ) : (
            filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full flex items-start gap-3 p-3 text-left hover:bg-muted/50 transition-colors border-b border-border/50 ${
                  selected?.id === c.id ? "bg-primary/5 border-l-2 border-l-primary" : ""
                }`}
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                    {initials(c.leads?.name ?? "?")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-medium text-sm truncate">{c.leads?.name ?? "—"}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">{formatDate(c.updated_at)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Badge variant="outline" className={`text-[9px] px-1 py-0 ${statusColor[c.leads?.status] ?? ""}`}>
                      {c.leads?.status ?? "—"}
                    </Badge>
                    <span className="text-xs text-muted-foreground truncate">{c.last_message || c.leads?.phone}</span>
                  </div>
                </div>
                {c.unread > 0 && (
                  <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shrink-0">
                    {c.unread}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat area */}
      {selected ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="h-14 px-4 flex items-center justify-between gap-3 border-b bg-card/50 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {initials(selected.leads?.name ?? "?")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="font-medium text-sm truncate">{selected.leads?.name}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {selected.leads?.phone}
                </div>
              </div>
            </div>
            <Badge variant="outline" className={`text-xs ${statusColor[selected.leads?.status] ?? ""}`}>
              {selected.leads?.status}
            </Badge>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-muted/10">
            {loadingMessages ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                    <Skeleton className={`h-10 rounded-2xl ${i % 2 === 0 ? "w-40" : "w-56"}`} />
                  </div>
                ))}
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                <MessageSquare className="h-10 w-10 opacity-20" />
                <p className="text-sm">Nenhuma mensagem ainda. Inicie a conversa!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isAgent = msg.sender === "agent" || msg.sender === "ai";
                return (
                  <div key={msg.id} className={`flex ${isAgent ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                      isAgent
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-card text-foreground rounded-bl-md border"
                    }`}>
                      <p className="whitespace-pre-wrap break-words leading-relaxed">{msg.content}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                        isAgent ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}>
                        {formatTime(msg.created_at)}
                        {isAgent && <CheckCheck className="h-3 w-3" />}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-card/50 shrink-0">
            <div className="flex items-end gap-2">
              <Textarea
                placeholder="Digite uma mensagem... (Enter para enviar)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                className="resize-none min-h-[40px] max-h-32 text-sm"
                disabled={sendMutation.isPending}
              />
              <Button
                size="icon"
                className="h-10 w-10 shrink-0"
                onClick={handleSend}
                disabled={!message.trim() || sendMutation.isPending}
              >
                {sendMutation.isPending
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center space-y-3">
            <MessageSquare className="h-12 w-12 mx-auto opacity-20" />
            <p className="text-sm">Selecione uma conversa ou crie um novo contato</p>
            <Button size="sm" onClick={() => setNewContactOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> Novo contato
            </Button>
          </div>
        </div>
      )}

      {/* New contact dialog */}
      <Dialog open={newContactOpen} onOpenChange={setNewContactOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-4 w-4" /> Novo Contato
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Nome *</Label>
              <Input placeholder="Nome completo" value={newName} onChange={(e) => setNewName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Telefone *</Label>
              <Input placeholder="+55 11 99999-9999" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>E-mail</Label>
              <Input placeholder="email@exemplo.com" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewContactOpen(false)}>Cancelar</Button>
            <Button
              onClick={() => createMutation.mutate()}
              disabled={!newName.trim() || !newPhone.trim() || createMutation.isPending}
            >
              {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
