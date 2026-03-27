import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Building2, Webhook, Users, ImagePlus, Trash2, Plus, Pencil,
  ToggleLeft, ToggleRight, ChevronDown, ChevronUp, Check, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useSettings, useUpdateSettings } from "@/hooks/use-settings";
import {
  useTeamMembers, useCreateTeamMember, useUpdateTeamMember, useDeleteTeamMember,
  roleLabels, rolePermissions, roleColors,
  type TeamRole, type TeamMember,
} from "@/hooks/use-team";

const memberSchema = z.object({
  name: z.string().min(2, "Informe o nome"),
  email: z.string().email("E-mail inválido"),
  role: z.enum(["administrador", "operador", "visualizador"]),
  ativo: z.boolean(),
});
type MemberForm = z.infer<typeof memberSchema>;

export default function Configuracoes() {
  // Settings
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");

  // Logo
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Team
  const { data: members = [], isLoading: loadingMembers } = useTeamMembers();
  const createMember = useCreateTeamMember();
  const updateMember = useUpdateTeamMember();
  const deleteMember = useDeleteTeamMember();
  const [memberDialog, setMemberDialog] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);
  const [expandedRole, setExpandedRole] = useState<TeamRole | null>(null);

  const form = useForm<MemberForm>({
    resolver: zodResolver(memberSchema),
    defaultValues: { name: "", email: "", role: "operador", ativo: true },
  });

  useEffect(() => {
    if (settings) {
      setCompanyName(settings.company_name);
      setCompanyEmail(settings.company_email);
    }
    const saved = localStorage.getItem("company_logo");
    if (saved) setLogoUrl(saved);
  }, [settings]);

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Máximo 2MB."); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setLogoUrl(result);
      localStorage.setItem("company_logo", result);
      toast.success("Logo atualizada!");
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveLogo() {
    setLogoUrl(null);
    localStorage.removeItem("company_logo");
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.success("Logo removida.");
  }

  function openCreate() {
    setEditingMember(null);
    form.reset({ name: "", email: "", role: "operador", ativo: true });
    setMemberDialog(true);
  }

  function openEdit(m: TeamMember) {
    setEditingMember(m);
    form.reset({ name: m.name, email: m.email, role: m.role, ativo: m.ativo });
    setMemberDialog(true);
  }

  async function onSubmitMember(values: MemberForm) {
    try {
      if (editingMember) {
        await updateMember.mutateAsync({ id: editingMember.id, ...values });
        toast.success("Usuário atualizado.");
      } else {
        await createMember.mutateAsync(values);
        toast.success("Usuário adicionado.");
      }
      setMemberDialog(false);
    } catch {
      toast.error("Erro ao salvar usuário.");
    }
  }

  async function toggleAtivo(m: TeamMember) {
    try {
      await updateMember.mutateAsync({ id: m.id, ativo: !m.ativo });
    } catch {
      toast.error("Erro ao atualizar status.");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteMember.mutateAsync(deleteTarget.id);
      toast.success("Usuário removido.");
    } catch {
      toast.error("Erro ao remover usuário.");
    } finally {
      setDeleteTarget(null);
    }
  }

  const isSaving = createMember.isPending || updateMember.isPending;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-3xl mx-auto">
        <Skeleton className="h-8 w-48" />
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-40" />)}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
        <p className="text-sm text-muted-foreground">Gerencie as configurações do sistema</p>
      </div>

      {/* Logo */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ImagePlus className="h-4 w-4 text-primary" /> Logo da Empresa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-xl border-2 border-dashed border-border bg-muted/30 flex items-center justify-center overflow-hidden shrink-0">
              {logoUrl
                ? <img src={logoUrl} alt="Logo" className="h-full w-full object-contain p-1" />
                : <ImagePlus className="h-7 w-7 text-muted-foreground" />}
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">PNG, JPG ou SVG. Máximo 2MB.</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  {logoUrl ? "Trocar logo" : "Fazer upload"}
                </Button>
                {logoUrl && (
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={handleRemoveLogo}>
                    <Trash2 className="h-4 w-4 mr-1" /> Remover
                  </Button>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empresa */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" /> Empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nome da Empresa</Label>
            <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>E-mail</Label>
            <Input value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} />
          </div>
          <Button onClick={() => settings && updateSettings.mutate(
            { id: settings.id, company_name: companyName, company_email: companyEmail },
            { onSuccess: () => toast.success("Configurações salvas!") }
          )} disabled={updateSettings.isPending}>
            {updateSettings.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </CardContent>
      </Card>

      {/* API WhatsApp */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Webhook className="h-4 w-4 text-primary" /> API WhatsApp
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>API Key</Label>
            <Input defaultValue={settings?.api_key || ""} type="password" />
          </div>
          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <Input defaultValue={settings?.webhook_url || ""} readOnly />
          </div>
          <Button variant="outline">Testar Conexão</Button>
        </CardContent>
      </Card>

      {/* Funções e permissões */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" /> Funções e Permissões
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(["administrador", "operador", "visualizador"] as TeamRole[]).map((role) => (
            <div key={role} className="rounded-xl border overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
                onClick={() => setExpandedRole(expandedRole === role ? null : role)}
              >
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={`text-xs ${roleColors[role]}`}>
                    {roleLabels[role]}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {rolePermissions[role].length} permissões
                  </span>
                </div>
                {expandedRole === role
                  ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </button>
              {expandedRole === role && (
                <div className="px-4 pb-4 grid gap-2">
                  {rolePermissions[role].map((perm) => (
                    <div key={perm} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{perm}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Usuários */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Usuários
            </CardTitle>
            <Button size="sm" onClick={openCreate}>
              <Plus className="h-4 w-4 mr-1.5" /> Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loadingMembers ? (
            <div className="space-y-2">
              {[1, 2].map((i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
            </div>
          ) : members.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">Nenhum usuário cadastrado.</p>
          ) : (
            <div className="space-y-2">
              {members.map((m) => (
                <div
                  key={m.id}
                  className={`flex items-center justify-between gap-3 rounded-xl border p-3 transition-opacity ${!m.ativo ? "opacity-50" : ""}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center shrink-0">
                      {m.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{m.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{m.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className={`text-[10px] hidden sm:flex ${roleColors[m.role]}`}>
                      {roleLabels[m.role]}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(m)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleAtivo(m)}>
                      {m.ativo
                        ? <ToggleRight className="h-4 w-4 text-primary" />
                        : <ToggleLeft className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(m)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog adicionar/editar usuário */}
      <Dialog open={memberDialog} onOpenChange={setMemberDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingMember ? "Editar usuário" : "Adicionar usuário"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitMember)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl><Input placeholder="Nome completo" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl><Input placeholder="email@empresa.com" type="email" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="role" render={({ field }) => (
                <FormItem>
                  <FormLabel>Função</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(["administrador", "operador", "visualizador"] as TeamRole[]).map((r) => (
                        <SelectItem key={r} value={r}>
                          <div className="flex flex-col">
                            <span>{roleLabels[r]}</span>
                            <span className="text-xs text-muted-foreground">
                              {rolePermissions[r].length} permissões
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  {/* Preview das permissões da função selecionada */}
                  {form.watch("role") && (
                    <div className="mt-2 rounded-lg bg-muted/40 p-3 space-y-1.5">
                      {rolePermissions[form.watch("role") as TeamRole].map((p) => (
                        <div key={p} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <Check className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                          {p}
                        </div>
                      ))}
                    </div>
                  )}
                </FormItem>
              )} />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setMemberDialog(false)}>Cancelar</Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingMember ? "Salvar" : "Adicionar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Confirmação de exclusão */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Remover <strong>{deleteTarget?.name}</strong>? Esta ação não pode ser desfeita.
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
