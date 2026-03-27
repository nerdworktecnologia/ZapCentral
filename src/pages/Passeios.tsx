import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2, MapPin, Clock, Users, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

import {
  usePasseios, useCreatePasseio, useUpdatePasseio, useDeletePasseio,
  type Passeio,
} from "@/hooks/use-passeios";

const categorias = ["Cultural", "Aventura", "Náutico", "Gastronomia", "Rural", "Noturno", "Outro"];

const schema = z.object({
  nome: z.string().min(2, "Informe o nome do passeio"),
  descricao: z.string().optional(),
  valor: z.coerce.number().min(0, "Valor inválido"),
  duracao: z.string().optional(),
  vagas_total: z.coerce.number().int().min(1, "Mínimo 1 vaga"),
  vagas_disponiveis: z.coerce.number().int().min(0, "Valor inválido"),
  categoria: z.string().optional(),
  imagem_url: z.string().url("URL inválida").optional().or(z.literal("")),
  ativo: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Passeios() {
  const { data: passeios = [], isLoading } = usePasseios();
  const createPasseio = useCreatePasseio();
  const updatePasseio = useUpdatePasseio();
  const deletePasseio = useDeletePasseio();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Passeio | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Passeio | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "", descricao: "", valor: 0, duracao: "",
      vagas_total: 10, vagas_disponiveis: 10, categoria: "", imagem_url: "", ativo: true,
    },
  });

  function openCreate() {
    setEditing(null);
    form.reset({
      nome: "", descricao: "", valor: 0, duracao: "",
      vagas_total: 10, vagas_disponiveis: 10, categoria: "", imagem_url: "", ativo: true,
    });
    setDialogOpen(true);
  }

  function openEdit(p: Passeio) {
    setEditing(p);
    form.reset({
      nome: p.nome,
      descricao: p.descricao ?? "",
      valor: p.valor,
      duracao: p.duracao ?? "",
      vagas_total: p.vagas_total,
      vagas_disponiveis: p.vagas_disponiveis,
      categoria: p.categoria ?? "",
      imagem_url: p.imagem_url ?? "",
      ativo: p.ativo,
    });
    setDialogOpen(true);
  }

  async function onSubmit(values: FormValues) {
    const payload = {
      ...values,
      descricao: values.descricao || null,
      duracao: values.duracao || null,
      categoria: values.categoria || null,
      imagem_url: values.imagem_url || null,
    };

    try {
      if (editing) {
        await updatePasseio.mutateAsync({ id: editing.id, ...payload });
        toast({ title: "Passeio atualizado com sucesso." });
      } else {
        await createPasseio.mutateAsync(payload);
        toast({ title: "Passeio criado com sucesso." });
      }
      setDialogOpen(false);
    } catch {
      toast({ title: "Erro ao salvar passeio.", variant: "destructive" });
    }
  }

  async function toggleAtivo(p: Passeio) {
    try {
      await updatePasseio.mutateAsync({ id: p.id, ativo: !p.ativo });
    } catch {
      toast({ title: "Erro ao atualizar status.", variant: "destructive" });
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deletePasseio.mutateAsync(deleteTarget.id);
      toast({ title: "Passeio removido." });
    } catch {
      toast({ title: "Erro ao remover passeio.", variant: "destructive" });
    } finally {
      setDeleteTarget(null);
    }
  }

  const ativos = passeios.filter((p) => p.ativo).length;
  const totalVagas = passeios.reduce((acc, p) => acc + p.vagas_disponiveis, 0);
  const isSaving = createPasseio.isPending || updatePasseio.isPending;

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Passeios</h1>
          <p className="text-sm text-muted-foreground">Catálogo de passeios disponíveis para venda</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Passeio
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-muted-foreground">Total de passeios</div>
            <div className="text-2xl font-semibold mt-1">{passeios.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-muted-foreground">Passeios ativos</div>
            <div className="text-2xl font-semibold mt-1 text-primary">{ativos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-muted-foreground">Vagas disponíveis</div>
            <div className="text-2xl font-semibold mt-1">{totalVagas}</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Carregando passeios...
        </div>
      ) : passeios.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
          <MapPin className="h-8 w-8" />
          <p className="text-sm">Nenhum passeio cadastrado ainda.</p>
          <Button variant="outline" size="sm" onClick={openCreate}>
            Cadastrar primeiro passeio
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {passeios.map((p) => (
            <Card key={p.id} className={`rounded-2xl transition-opacity ${!p.ativo ? "opacity-60" : ""}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base leading-snug">{p.nome}</CardTitle>
                  <Badge variant={p.ativo ? "default" : "secondary"} className="shrink-0 text-xs">
                    {p.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                {p.categoria && (
                  <span className="text-xs text-muted-foreground">{p.categoria}</span>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {p.descricao && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{p.descricao}</p>
                )}

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    <span>{p.duracao ?? "—"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="h-3.5 w-3.5 shrink-0" />
                    <span>{p.vagas_disponiveis}/{p.vagas_total} vagas</span>
                  </div>
                </div>

                <div className="text-lg font-semibold text-primary">{formatCurrency(p.valor)}</div>

                <div className="flex items-center gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => openEdit(p)}
                  >
                    <Pencil className="h-3.5 w-3.5 mr-1.5" />
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => toggleAtivo(p)}
                    title={p.ativo ? "Desativar" : "Ativar"}
                  >
                    {p.ativo
                      ? <ToggleRight className="h-4 w-4 text-primary" />
                      : <ToggleLeft className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => setDeleteTarget(p)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog criar/editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar passeio" : "Novo passeio"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="nome" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do passeio</FormLabel>
                  <FormControl><Input placeholder="Ex: City Tour Histórico" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="descricao" render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva o passeio..." rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="valor" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step={0.01} placeholder="0,00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="duracao" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duração</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 4 horas" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="vagas_total" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vagas totais</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="vagas_disponiveis" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vagas disponíveis</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="categoria" render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categorias.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="imagem_url" render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da imagem (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editing ? "Salvar alterações" : "Criar passeio"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Confirmação de exclusão */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover passeio</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover <strong>{deleteTarget?.nome}</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
