import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type PaymentStatus = "Pago" | "Pendente" | "Processando";
type PaymentType = "Reserva" | "Repasse";

interface Payment {
  id: number;
  hospede: string;
  imovel: string;
  valor: number;
  tipo: PaymentType;
  status: PaymentStatus;
  data: string;
}

const payments: Payment[] = [
  { id: 1, hospede: "Ana Lima", imovel: "Apto 302 — Copacabana", valor: 4800, tipo: "Reserva", status: "Pago", data: "24/03/2026" },
  { id: 2, hospede: "Carlos Mendes", imovel: "Casa Praia — Búzios", valor: 3200, tipo: "Repasse", status: "Pago", data: "23/03/2026" },
  { id: 3, hospede: "Beatriz Souza", imovel: "Studio 101 — Ipanema", valor: 2100, tipo: "Reserva", status: "Processando", data: "22/03/2026" },
  { id: 4, hospede: "Rafael Torres", imovel: "Apto 501 — Barra", valor: 5600, tipo: "Reserva", status: "Pendente", data: "21/03/2026" },
  { id: 5, hospede: "Fernanda Costa", imovel: "Cobertura — Leblon", valor: 9800, tipo: "Repasse", status: "Pago", data: "20/03/2026" },
  { id: 6, hospede: "João Pereira", imovel: "Chalé — Serra Gaúcha", valor: 1850, tipo: "Reserva", status: "Pago", data: "19/03/2026" },
  { id: 7, hospede: "Mariana Alves", imovel: "Apto 204 — Floripa", valor: 3400, tipo: "Repasse", status: "Processando", data: "18/03/2026" },
  { id: 8, hospede: "Pedro Nunes", imovel: "Casa 7 — Gramado", valor: 2750, tipo: "Reserva", status: "Pendente", data: "17/03/2026" },
  { id: 9, hospede: "Luciana Rocha", imovel: "Studio 03 — Arraial", valor: 1920, tipo: "Repasse", status: "Pago", data: "16/03/2026" },
  { id: 10, hospede: "Thiago Barbosa", imovel: "Apto 810 — Fortaleza", valor: 4200, tipo: "Reserva", status: "Pago", data: "15/03/2026" },
];

const statusStyles: Record<PaymentStatus, string> = {
  Pago: "bg-success/10 text-success border-success/20",
  Processando: "bg-warning/10 text-warning border-warning/20",
  Pendente: "bg-destructive/10 text-destructive border-destructive/20",
};

const tipoStyles: Record<PaymentType, string> = {
  Reserva: "bg-primary/10 text-primary border-primary/20",
  Repasse: "bg-info/10 text-info border-info/20",
};

export default function Pagamentos() {
  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Pagamentos — Gestão e Repasses</h1>
        <p className="text-muted-foreground text-sm">Acompanhe recebimentos, repasses e inadimplências</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Total Recebido</span>
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wallet className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold text-primary">R$ 48.320</div>
            <div className="text-xs text-muted-foreground mt-1">Mês atual</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Repasses Realizados</span>
              <div className="h-9 w-9 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
            </div>
            <div className="text-2xl font-bold">R$ 38.650</div>
            <div className="text-xs text-muted-foreground mt-1">Aos proprietários</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Pendentes</span>
              <div className="h-9 w-9 rounded-lg bg-warning/10 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-warning" />
              </div>
            </div>
            <div className="text-2xl font-bold">R$ 9.670</div>
            <div className="text-xs text-muted-foreground mt-1">Aguardando liquidação</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Taxa de Inadimplência</span>
              <div className="h-9 w-9 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-destructive" />
              </div>
            </div>
            <div className="text-2xl font-bold">2,1%</div>
            <div className="text-xs text-muted-foreground mt-1">Dentro da meta</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Lançamentos Recentes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hóspede</TableHead>
                <TableHead>Imóvel</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{payment.hospede}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{payment.imovel}</TableCell>
                  <TableCell className="font-semibold">
                    R$ {payment.valor.toLocaleString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] ${tipoStyles[payment.tipo]}`}>
                      {payment.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] ${statusStyles[payment.status]}`}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">{payment.data}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
