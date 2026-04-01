import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Reveal } from "@/components/marketing/Reveal"
import { tours, Tour } from "@/data/tours"

function formatBRL(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 }).format(v)
}

export function ToursSection() {
  const [pax, setPax] = useState<4 | 6>(4)
  const [query, setQuery] = useState("")

  const filtered: Tour[] = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tours
      .filter((t) => (q ? t.servico.toLowerCase().includes(q) : true))
      .sort((a, b) => a.servico.localeCompare(b.servico))
  }, [query])

  return (
    <section id="traslados" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <Reveal>
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Traslados e passeios</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Valores em BRL por veículo. Selecione a capacidade e filtre por nome.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-2">
              <Button variant={pax === 4 ? "default" : "outline"} onClick={() => setPax(4)}>
                Até 4 passageiros
              </Button>
              <Button variant={pax === 6 ? "default" : "outline"} onClick={() => setPax(6)}>
                Até 6 passageiros
              </Button>
            </div>
            <div className="w-full md:w-80">
              <Input placeholder="Buscar passeio/traslado" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => {
              const price = pax === 4 ? t.pax4 : t.pax6
              const show = price != null
              return (
                <Card key={t.servico} className="rounded-2xl transition-shadow hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-base">{t.servico}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {pax === 4 ? "Até 4 pax" : "Até 6 pax"}
                    </div>
                    <div className="text-lg font-semibold">
                      {show ? formatBRL(price as number) : "Não informado"}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
