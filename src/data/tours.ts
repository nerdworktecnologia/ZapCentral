export type Tour = {
  servico: string
  pax4: number | null
  pax6: number | null
  moeda: "BRL"
  observacao?: string
}

export const tours: Tour[] = [
  { servico: "Cataratas Brasil", pax4: 260, pax6: 300, moeda: "BRL" },
  { servico: "Cataratas Argentina", pax4: 400, pax6: 480, moeda: "BRL" },
  { servico: "Paraguai", pax4: 350, pax6: 390, moeda: "BRL" },
  { servico: "Parque das Aves", pax4: 260, pax6: 300, moeda: "BRL" },
  { servico: "Marco das Três Fronteiras", pax4: 190, pax6: 220, moeda: "BRL" },
  { servico: "City Tour", pax4: 240, pax6: 260, moeda: "BRL" },
  { servico: "Transfer in/out", pax4: 130, pax6: 160, moeda: "BRL" },
  { servico: "Dreams Park", pax4: 240, pax6: 260, moeda: "BRL" },
  { servico: "Wonder Park", pax4: 250, pax6: 290, moeda: "BRL" },
  { servico: "Aqua Foz", pax4: 260, pax6: 300, moeda: "BRL" },
  { servico: "Blue Park", pax4: 140, pax6: 170, moeda: "BRL" },
  { servico: "Yup Star", pax4: 170, pax6: 190, moeda: "BRL" },
  { servico: "Itaipu", pax4: 260, pax6: 300, moeda: "BRL" },
  { servico: "Jantar Rafain", pax4: 170, pax6: null, moeda: "BRL", observacao: "preço único/por pessoa?" },
  { servico: "Kattamaram", pax4: 240, pax6: null, moeda: "BRL", observacao: "preço único/por pessoa?" }
]
