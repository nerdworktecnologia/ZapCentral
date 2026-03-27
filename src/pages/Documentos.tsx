import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, CheckCircle2, Clock, Upload, Loader2, Download } from "lucide-react";
import { toast } from "sonner";
import { exportReport } from "@/lib/export-report";

type DocumentStatus = "Recebido" | "Pendente" | "Parcial";

interface DocumentRequest {
  id: number;
  hospede: string;
  whatsapp: string;
  imovel: string;
  documentos: string[];
  status: DocumentStatus;
  data: string;
}

const DOCS_OPTIONS = ["RG", "CPF", "Contrato", "Comprovante de residência", "CNH"];

const schema = z.object({
  hospede: z.string().min(2, "Informe o nome do hóspede"),
  whatsapp: z.string().min(10, "Informe o WhatsApp"),
  imovel: z.string().min(2, "Informe o imóvel"),
  documentos: z.array(z.string()).min(1, "Selecione ao menos um documento"),
});

type FormValues = z.infer<typeof schema>;

const statusStyles: Record<DocumentStatus, string> = {
  Recebido: "bg-success/10 text-success border-success/20",
  Parcial: "bg-warning/10 text-warning border-warning/20",
  Pendente: "bg-destructive/10 text-destructive border-destructive/20",
};

const initialRequests: DocumentRequest[] = [
  { id: 1, hospede: "Ana Lima", whatsapp: "+5521999990001", imovel: "Apto 302 — Copacabana", documentos: ["RG", "CPF", "Contrato"], status: "Recebido", data: "24/03/2026" },
  { id: 2, hospede: "Carlos Mendes", whatsapp: "+5521999990002", imovel: "Casa Praia — Búzios", documentos: ["RG", "CPF"], status: "Recebido", data: "23/03/2026" },
  { id: 3, hospede: "Beatriz Souza", whatsapp: "+5521999990003", imovel: "Studio 101 — Ipanema", documentos: ["RG", "CPF", "Contrato"], status: "Parcial", data: "22/03/2026" },
  { id: 4, hospede: "Rafael Torres", whatsapp: "+5521999990004", imovel: "Apto 501 — Barra", documentos: ["RG", "Contrato"], status: "Pendente", data: "21/03/2026" },
  { id: 5, hospede: "Fernanda Costa", whatsapp: "+5521999990005", imovel: "Cobertura — Leblon", documentos: ["RG", "CPF", "Contrato"], status: "Recebido", data: "20/03/2026" },
];

export default function Documentos() {
  const [requests, setRequests] = useState<DocumentRequest[]>(initialRequests);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { hospede: "", whatsapp: "", imovel: "", documentos: [] },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));

    const newRequest: DocumentRequest = {
      id: Date.now(),
      hospede: values.hospede,
      whatsapp: values.whatsapp,
      imovel: values.imovel,
      documentos: values.documentos,
      status: "Pendente",
      data: new Date().toLocaleDateString("pt-BR"),
    };

    setRequests((prev) => [newRequest, ...prev]);
    setSubmitting(false);
    setDialogOpen(false);
    form.reset();
    toast.success(`Solicitação enviada para ${values.hospede} via WhatsApp.`);
  }

  const recebidos = requests.filter((r) => r.status === "Recebido").length;
  const pendentes = requests.filter((r) => r.status === "Pendente").length;
  const taxa = Math.round((recebidos / requests.length) * 100);

  function handleExport() {
    exportReport({
      title: "Relatório de Documentos",
      subtitle: "Coleta de documentos via WhatsApp",
      columns: [
        { key: "hospede",    label: "Hóspede" },
        { key: "whatsapp",   label: "WhatsApp" },
        { key: "imovel",     label: "Imóvel" },
        { key: "documentos", label: "Documentos", format: (v) => (v as string[]).join(", ") },
        { key: "status",     label: "Status" },
        { key: "data",       label: "Data", align: "right" },
      ],
      rows: requests as unknown as Record<string, unknown>[],
      summaryRows: [
        { label: "Total de Solicitações", value: String(requests.length) },
        { label: "Recebidos",             value: String(recebidos) },
        { label: "Pendentes",             value: String(pendentes) },
        { label: "Taxa de Retorno",       value: `${taxa}%` },
      ],
    });
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Documentos</h1>
          <p className="text-sm text-muted-foreground">Coleta de documentos via WhatsApp</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={() => setDialogOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Solicitar Documentos
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Solicitações</span>
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-semibold">{requests.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Recebidos</span>
              <div className="h-9 w-9 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-semibold">{recebidos}</div>
            <div className="text-xs text-muted-foreground mt-1">Completos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Pendentes</span>
              <div className="h-9 w-9 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Clock className="h-4 w-4 text-destructive" />
              </div>
            </div>
            <div className="text-2xl font-semibold">{pendentes}</div>
            <div className="text-xs text-muted-foreground mt-1">Aguardando</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Taxa de Retorno</span>
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Upload className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-semibold text-primary">{taxa}%</div>
            <div className="text-xs text-muted-foreground mt-1">Recebidos / Total</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Solicitações</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hóspede</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Imóvel</TableHead>
                <TableHead>Documentos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{req.hospede}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{req.whatsapp}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{req.imovel}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {req.documentos.map((doc) => (
                        <Badge key={doc} variant="outline" className="text-[10px]">{doc}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] ${statusStyles[req.status]}`}>
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">{req.data}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog solicitar documentos */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Solicitar Documentos</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="hospede" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do hóspede</FormLabel>
                  <FormControl><Input placeholder="Nome completo" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="whatsapp" render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp</FormLabel>
                  <FormControl>
                    <Input placeholder="(11) 99999-9999" inputMode="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="imovel" render={({ field }) => (
                <FormItem>
                  <FormLabel>Imóvel</FormLabel>
                  <FormControl><Input placeholder="Ex: Apto 302 — Copacabana" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="documentos" render={() => (
                <FormItem>
                  <FormLabel>Documentos solicitados</FormLabel>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {DOCS_OPTIONS.map((doc) => (
                      <FormField
                        key={doc}
                        control={form.control}
                        name="documentos"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(doc)}
                                onCheckedChange={(checked) => {
                                  const current = field.value ?? [];
                                  field.onChange(
                                    checked ? [...current, doc] : current.filter((d) => d !== doc)
                                  );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal text-sm cursor-pointer">{doc}</FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )} />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Enviar solicitação
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
