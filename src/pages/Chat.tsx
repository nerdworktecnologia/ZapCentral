import { useState } from "react";
import { conversations as initialConvos, Conversation, Message } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, Search, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const channelIcon: Record<string, string> = { whatsapp: "🟢", instagram: "📸" };

export default function Chat() {
  const [convos] = useState<Conversation[]>(initialConvos);
  const [selected, setSelected] = useState<Conversation | null>(convos[0]);
  const [messages, setMessages] = useState<Message[]>(convos[0]?.messages || []);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  const selectConvo = (c: Conversation) => {
    setSelected(c);
    setMessages(c.messages);
  };

  const sendMessage = () => {
    if (!input.trim() || !selected) return;
    const newMsg: Message = {
      id: `m${Date.now()}`, leadId: selected.lead.id, content: input,
      sender: "agent", channel: selected.channel, timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    // Simulated AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: `m${Date.now() + 1}`, leadId: selected.lead.id,
        content: "Obrigado pelo contato! Vou verificar as opções disponíveis para você. 😊",
        sender: "ai", channel: selected.channel,
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1500);
  };

  const filtered = convos.filter((c) =>
    c.lead.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Sidebar de conversas */}
      <div className="w-80 border-r flex flex-col bg-card shrink-0">
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar conversas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => selectConvo(c)}
              className={`w-full flex items-start gap-3 p-3 text-left hover:bg-muted/50 transition-colors border-b border-border/50 ${
                selected?.id === c.id ? "bg-primary/5" : ""
              }`}
            >
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                  {c.lead.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm truncate">{c.lead.name}</span>
                  <span className="text-[10px] text-muted-foreground">{c.lastMessageTime}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs">{channelIcon[c.channel]}</span>
                  <span className="text-xs text-muted-foreground truncate">{c.lastMessage}</span>
                </div>
              </div>
              {c.unread > 0 && (
                <Badge className="bg-primary text-primary-foreground h-5 w-5 flex items-center justify-center rounded-full text-[10px] p-0 shrink-0">
                  {c.unread}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Área do chat */}
      {selected ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="h-14 px-4 flex items-center gap-3 border-b bg-card/50">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {selected.lead.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-sm">{selected.lead.name}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                {channelIcon[selected.channel]} {selected.channel === "whatsapp" ? "WhatsApp" : "Instagram"} · {selected.lead.phone}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
            {messages.map((msg) => {
              const isLead = msg.sender === "lead";
              const isAi = msg.sender === "ai";
              return (
                <div key={msg.id} className={`flex ${isLead ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                    isLead
                      ? "bg-muted text-foreground rounded-bl-md"
                      : isAi
                        ? "bg-primary/10 text-foreground rounded-br-md border border-primary/20"
                        : "bg-primary text-primary-foreground rounded-br-md"
                  }`}>
                    {isAi && (
                      <div className="flex items-center gap-1 text-[10px] text-primary font-medium mb-1">
                        <Bot className="h-3 w-3" /> IA
                      </div>
                    )}
                    <p>{msg.content}</p>
                    <span className={`text-[10px] mt-1 block ${isLead ? "text-muted-foreground" : isAi ? "text-muted-foreground" : "text-primary-foreground/70"}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-card/50">
            <div className="flex gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1"
              />
              <Button onClick={sendMessage} size="icon" className="shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Selecione uma conversa</p>
          </div>
        </div>
      )}
    </div>
  );
}
