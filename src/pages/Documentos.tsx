import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle2, Clock, Upload } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type DocumentStatus = "Recebido" | "Pendente" | "Parcial";

interface DocumentRequest {
  id: number;
  hospede: string;
  imovel: string;
  documentos: string[];
  status: DocumentStatus;
  data: string;
}

const documentRequests: DocumentRequest[] = [
  { id: 1, hospede: "Ana Lima", imovel: "Apto 302 — Copacabana", documentos: ["RG", "CPF", "Contrato"], status: "Recebido", data: "24/03/2026" },
  { id: 2, hospede: "Carlos Mendes", imovel: "Casa Praia — Búzios", documentos: ["RG", "CPF"], status: "Recebido", data: "23/03/2026" },
  { id: 3, hospede: "Beatriz Souza", imovel: "Studio 101 — Ipanema", documentos: ["RG", "CPF", "Contrato"], status: "Parcial", data: "22/03/2026" },
  { id: 4, hospede: "Rafael Torres", imovel: "Apto 501 — Barra", documentos: ["RG", "Contrato"], status: "Pendente", data: "21/03/2026" },
  { id: 5, hospede: "Fernanda Costa", imovel: "Cobertura — Leblon", documentos: ["RG", "CPF", "Contrato"], status: "Recebido", data: "20/03/2026" },
  { id: 6, hospede: "João Pereira", imovel: "Chalé — Serra Gaúcha", documentos: ["CPF", "Contrato"], status: "Pendente", data: "19/03/2026" },
  { id: 7, hospede: "Mariana Alves", imovel: "Apto 204 — Floripa", documentos: ["RG", "CPF", "Contrato"], status: "Recebido", data: "18/03/2026" },
  { id: 8, hospede: "Pedro Nunes", imovel: "Casa 7 — Gramado", documentos: ["RG", "CPF"], status: "Parcial", data: "17/03/2026" },
  { id: 9, hospede: "Luciana Rocha", imovel: "Studio 03 — Arraial", documentos: ["RG", "CPF", "Contrato"], status: "Recebido", data: "16/03/2026" },
  { id: 10, hospede: "Thiago Barbosa", imovel: "Apto 810 — Fortaleza", documentos: ["Contrato"], status: "Pendente", data: "15/03/2026" },
];

const statusStyles: Record<DocumentStatus, string> = {
  Recebido: "bg-success/10 text-success border-success/20",
  Parcial: "bg-warning/10 text-warning border-warning/20",
  Pendente: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function Documentos() {
  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Documentos — Coleta via WhatsApp</h1>
          <p className="text-muted-foreground text-sm">Gerencie solicitações de documentos enviadas aos hóspedes</p>
        </div>
        <Button className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Solicitar Documentos
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Solicitações Enviadas</span>
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold">47</div>
            <div className="text-xs text-muted-foreground mt-1">Total do mês</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Documentos Recebidos</span>
              <div className="h-9 w-9 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-success" />
              </div>
            </div>
            <div className="text-2xl font-bold">38</div>
            <div className="text-xs text-muted-foreground mt-1">Completos</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Pendentes</span>
              <div className="h-9 w-9 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Clock className="h-4 w-4 text-destructive" />
              </div>
            </div>
            <div className="text-2xl font-bold">9</div>
            <div className="text-xs text-muted-foreground mt-1">Aguardando retorno</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Taxa de Retorno</span>
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Upload className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold text-primary">81%</div>
            <div className="text-xs text-muted-foreground mt-1">Docs recebidos / enviados</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Solicitações Recentes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hóspede</TableHead>
                <TableHead>Imóvel</TableHead>
                <TableHead>Documentos Solicitados</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documentRequests.map((req) => (
                <TableRow key={req.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{req.hospede}</TableCell>
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
    </div>
  );
}
