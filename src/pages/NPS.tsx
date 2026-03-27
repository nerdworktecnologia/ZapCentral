import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Users, MessageSquare } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const npsTrendData = [
  { month: "Out", nps: 58 },
  { month: "Nov", nps: 63 },
  { month: "Dez", nps: 67 },
  { month: "Jan", nps: 70 },
  { month: "Fev", nps: 69 },
  { month: "Mar", nps: 72 },
];

const recentReviews = [
  { id: 1, nome: "Ana Lima", nota: 10, comentario: "Estadia perfeita, imóvel lindo e anfitrião super atencioso!", data: "24/03/2026" },
  { id: 2, nome: "Carlos Mendes", nota: 9, comentario: "Ótima localização e check-in muito fácil. Voltarei com certeza.", data: "22/03/2026" },
  { id: 3, nome: "Beatriz Souza", nota: 8, comentario: "Tudo conforme o anunciado. Cozinha bem equipada.", data: "20/03/2026" },
  { id: 4, nome: "Rafael Torres", nota: 6, comentario: "Imóvel bom, mas Wi-Fi ficou instável durante a estadia.", data: "18/03/2026" },
  { id: 5, nome: "Fernanda Costa", nota: 10, comentario: "Experiência incrível! Superou as expectativas.", data: "15/03/2026" },
  { id: 6, nome: "João Pereira", nota: 3, comentario: "Ar-condicionado com problema e demora no atendimento.", data: "13/03/2026" },
  { id: 7, nome: "Mariana Alves", nota: 9, comentario: "Muito aconchegante e limpo. Recomendo bastante.", data: "10/03/2026" },
  { id: 8, nome: "Pedro Nunes", nota: 7, comentario: "Estadia tranquila, só faltou mais utensílios na cozinha.", data: "08/03/2026" },
];

function notaBadgeClass(nota: number): string {
  if (nota >= 9) return "bg-success/10 text-success border-success/20";
  if (nota >= 7) return "bg-warning/10 text-warning border-warning/20";
  return "bg-destructive/10 text-destructive border-destructive/20";
}

function notaLabel(nota: number): string {
  if (nota >= 9) return "Promotor";
  if (nota >= 7) return "Neutro";
  return "Detrator";
}

export default function NPS() {
  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">NPS — Satisfação dos Hóspedes</h1>
        <p className="text-muted-foreground text-sm">Acompanhe o Net Promoter Score e avaliações dos hóspedes</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">NPS Score</span>
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold text-primary">72</div>
            <div className="text-xs text-muted-foreground mt-1">Excelente faixa</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Promotores</span>
              <div className="h-9 w-9 rounded-lg bg-success/10 flex items-center justify-center">
                <Star className="h-4 w-4 text-success" />
              </div>
            </div>
            <div className="text-2xl font-bold">68%</div>
            <div className="text-xs text-muted-foreground mt-1">Nota 9 ou 10</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Detratores</span>
              <div className="h-9 w-9 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-destructive" />
              </div>
            </div>
            <div className="text-2xl font-bold">8%</div>
            <div className="text-xs text-muted-foreground mt-1">Nota 0 a 6</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Pesquisas Enviadas</span>
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold">124</div>
            <div className="text-xs text-muted-foreground mt-1">Últimos 6 meses</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Evolução do NPS — Últimos 6 Meses</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={npsTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }}
                formatter={(value: number) => [value, "NPS Score"]}
              />
              <Bar dataKey="nps" fill="hsl(243, 75%, 59%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Avaliações Recentes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hóspede</TableHead>
                <TableHead>Nota</TableHead>
                <TableHead>Classificação</TableHead>
                <TableHead>Comentário</TableHead>
                <TableHead className="text-right">Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentReviews.map((review) => (
                <TableRow key={review.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{review.nome}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-warning fill-warning" />
                      <span className="font-semibold">{review.nota}</span>
                      <span className="text-muted-foreground text-xs">/10</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] ${notaBadgeClass(review.nota)}`}>
                      {notaLabel(review.nota)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{review.comentario}</TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">{review.data}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
