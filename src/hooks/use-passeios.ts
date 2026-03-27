import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Passeio = {
  id: string;
  nome: string;
  descricao: string | null;
  valor: number;
  duracao: string | null;
  vagas_total: number;
  vagas_disponiveis: number;
  categoria: string | null;
  ativo: boolean;
  imagem_url: string | null;
  created_at: string;
  updated_at: string;
};

export type PasseioInsert = Omit<Passeio, "id" | "created_at" | "updated_at">;
export type PasseioUpdate = Partial<PasseioInsert>;

const TABLE = "passeios" as const;

export function usePasseios() {
  return useQuery({
    queryKey: ["passeios"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from(TABLE)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Passeio[];
    },
  });
}

export function useCreatePasseio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: PasseioInsert) => {
      const { data, error } = await (supabase as any)
        .from(TABLE)
        .insert(values)
        .select()
        .single();
      if (error) throw error;
      return data as Passeio;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["passeios"] }),
  });
}

export function useUpdatePasseio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...values }: PasseioUpdate & { id: string }) => {
      const { data, error } = await (supabase as any)
        .from(TABLE)
        .update(values)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Passeio;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["passeios"] }),
  });
}

export function useDeletePasseio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from(TABLE).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["passeios"] }),
  });
}
