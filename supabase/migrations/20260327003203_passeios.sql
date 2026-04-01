-- Tabela de catálogo de passeios do cliente
CREATE TABLE IF NOT EXISTS passeios (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  descricao text,
  valor numeric(10, 2) NOT NULL DEFAULT 0,
  duracao text,
  vagas_total integer NOT NULL DEFAULT 10,
  vagas_disponiveis integer NOT NULL DEFAULT 10,
  categoria text,
  ativo boolean NOT NULL DEFAULT true,
  imagem_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Atualiza updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER passeios_updated_at
  BEFORE UPDATE ON passeios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE passeios ENABLE ROW LEVEL SECURITY;

-- Leitura pública (n8n e robô consultam sem autenticação)
CREATE POLICY "Leitura pública de passeios"
  ON passeios FOR SELECT USING (true);

-- Escrita apenas autenticada (admin do painel)
CREATE POLICY "Gestão autenticada de passeios"
  ON passeios FOR ALL USING (auth.role() = 'authenticated');

-- Dados iniciais — Turismo Foz do Iguaçu
-- Valores referentes a veículo privativo até 4 passageiros (ingresso não incluso)
INSERT INTO passeios (nome, descricao, valor, duracao, vagas_total, vagas_disponiveis, categoria) VALUES
  (
    'Cataratas do Iguaçu (Brasil)',
    'Visite o lado brasileiro das Cataratas do Iguaçu, uma das maiores maravilhas naturais do mundo. Veículo privativo com motorista. Até 4 pax: R$ 260 | Até 6 pax: R$ 300. Ingresso não incluso.',
    260.00, '4 horas', 6, 6, 'Aventura'
  ),
  (
    'Parque das Aves',
    'O maior parque de aves da América Latina, com mais de 900 espécies. Ótimo para famílias. Fica ao lado das Cataratas — pode ser combinado no mesmo dia. Até 4 pax: R$ 260 | Até 6 pax: R$ 300. Ingresso não incluso.',
    260.00, '3 horas', 6, 6, 'Cultural'
  ),
  (
    'Itaipu — Usina Hidrelétrica',
    'Conheça uma das maiores usinas hidrelétricas do mundo. Disponível visita diurna e o espetáculo Itaipu Luz (noturno). Até 4 pax: R$ 260 | Até 6 pax: R$ 300. Ingresso não incluso.',
    260.00, '3 horas', 6, 6, 'Cultural'
  );
