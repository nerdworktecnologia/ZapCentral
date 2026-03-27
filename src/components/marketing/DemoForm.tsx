import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const schema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  company: z.string().min(2, "Informe o nome da empresa"),
  whatsapp: z
    .string()
    .min(1, "Informe seu WhatsApp")
    .refine((v) => v.replace(/\D/g, "").length >= 10, "Informe um WhatsApp válido"),
  email: z.string().email("Informe um e-mail válido"),
  propertyCount: z.string().min(1, "Selecione a quantidade de imóveis"),
  channelManager: z.string().min(1, "Selecione seu channel manager"),
});

type DemoFormValues = z.infer<typeof schema>;

export function DemoForm() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const defaultValues = useMemo<DemoFormValues>(
    () => ({ name: "", company: "", whatsapp: "", email: "", propertyCount: "", channelManager: "" }),
    [],
  );

  const form = useForm<DemoFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onTouched",
  });

  async function onSubmit(values: DemoFormValues) {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 650));
    navigate("/obrigado", { state: { lead: values } });
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Solicitar demonstração</CardTitle>
        <p className="text-sm text-muted-foreground">
          Sem compromisso. Resposta em até 1 dia útil.
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" autoComplete="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empresa</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da empresa ou imobiliária" autoComplete="organization" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp</FormLabel>
                  <FormControl>
                    <Input placeholder="(11) 99999-9999" inputMode="tel" autoComplete="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="voce@empresa.com" autoComplete="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="propertyCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade de imóveis</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1-5">1 a 5 imóveis</SelectItem>
                      <SelectItem value="6-20">6 a 20 imóveis</SelectItem>
                      <SelectItem value="21-50">21 a 50 imóveis</SelectItem>
                      <SelectItem value="50+">Mais de 50 imóveis</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="channelManager"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Channel Manager</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="nao-uso">Não uso channel manager</SelectItem>
                      <SelectItem value="stays">Stays</SelectItem>
                      <SelectItem value="guesty">Guesty</SelectItem>
                      <SelectItem value="hostaway">Hostaway</SelectItem>
                      <SelectItem value="omnibees">Omnibees</SelectItem>
                      <SelectItem value="litto">Litto</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Enviando..." : "Solicitar demonstração"}
            </Button>
            <p className="text-xs text-muted-foreground">
              Ao enviar, você concorda em ser contatado para uma demonstração.
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
