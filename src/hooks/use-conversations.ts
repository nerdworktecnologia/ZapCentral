import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Conversation = Tables<"conversations"> & { leads: Tables<"leads"> };
export type Message = Tables<"messages">;

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select("*, leads(*)")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data as Conversation[];
    },
  });
}

export function useMessages(conversationId: string | null) {
  return useQuery({
    queryKey: ["messages", conversationId],
    enabled: !!conversationId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as Message[];
    },
  });
}

export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (msg: {
      conversation_id: string;
      lead_id: string;
      content: string;
      sender: "lead" | "agent" | "ai";
      channel: "whatsapp" | "instagram";
      timestamp: string;
    }) => {
      const { data, error } = await supabase
        .from("messages")
        .insert(msg)
        .select()
        .single();
      if (error) throw error;
      // Update conversation last message
      await supabase
        .from("conversations")
        .update({ last_message: msg.content, last_message_time: msg.timestamp })
        .eq("id", msg.conversation_id);
      return data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["messages", vars.conversation_id] });
      qc.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
