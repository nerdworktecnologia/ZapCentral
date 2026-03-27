import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type TeamRole = "administrador" | "operador" | "visualizador";

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  ativo: boolean;
  created_at: string;
  updated_at: string;
};

export type TeamMemberInsert = Omit<TeamMember, "id" | "created_at" | "updated_at">;
export type TeamMemberUpdate = Partial<TeamMemberInsert> & { id: string };

const TABLE = "team_members" as const;

export const roleLabels: Record<TeamRole, string> = {
  administrador: "Administrador",
  operador: "Operador",
  visualizador: "Visualizador",
};

export const rolePermissions: Record<TeamRole, string[]> = {
  administrador: [
    "Dashboard completo",
    "Gerenciar CRM e leads",
    "Ver e responder chat (via Chatwoot)",
    "Configurar IA e automações",
    "Gerenciar passeios (CRUD)",
    "Ver NPS e relatórios",
    "Gerenciar documentos e pagamentos",
    "Adicionar e remover usuários",
    "Alterar configurações do sistema",
  ],
  operador: [
    "Dashboard resumido",
    "Gerenciar CRM e leads",
    "Ver e responder chat (via Chatwoot)",
    "Gerenciar passeios (CRUD)",
    "Ver NPS",
    "Ver documentos e pagamentos",
  ],
  visualizador: [
    "Dashboard resumido",
    "Ver leads (somente leitura)",
    "Ver conversas (somente leitura)",
    "Ver passeios",
    "Ver NPS e relatórios",
  ],
};

export const roleColors: Record<TeamRole, string> = {
  administrador: "bg-primary/10 text-primary border-primary/20",
  operador: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  visualizador: "bg-muted text-muted-foreground",
};

export function useTeamMembers() {
  return useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from(TABLE)
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as TeamMember[];
    },
  });
}

export function useCreateTeamMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: TeamMemberInsert) => {
      const { data, error } = await (supabase as any)
        .from(TABLE)
        .insert(values)
        .select()
        .single();
      if (error) throw error;
      return data as TeamMember;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["team-members"] }),
  });
}

export function useUpdateTeamMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...values }: TeamMemberUpdate) => {
      const { data, error } = await (supabase as any)
        .from(TABLE)
        .update(values)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as TeamMember;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["team-members"] }),
  });
}

export function useDeleteTeamMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from(TABLE).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["team-members"] }),
  });
}
