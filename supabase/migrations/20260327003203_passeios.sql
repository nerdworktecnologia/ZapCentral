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

-- Dados iniciais de exemplo
INSERT INTO passeios (nome, descricao, valor, duracao, vagas_total, vagas_disponiveis, categoria) VALUES
  ('City Tour Histórico', 'Passeio pelos principais pontos históricos da cidade com guia especializado.', 85.00, '4 horas', 20, 20, 'Cultural'),
  ('Trilha na Mata Atlântica', 'Trilha guiada com nível moderado, cachoeira ao final do percurso.', 120.00, '6 horas', 12, 12, 'Aventura'),
  ('Passeio de Barco', 'Navegação pelas ilhas com paradas para mergulho e snorkel.', 180.00, '1 dia inteiro', 15, 15, 'Náutico'),
  ('Tour Gastronômico', 'Visita aos restaurantes e feiras locais com degustação inclusa.', 95.00, '3 horas', 10, 10, 'Gastronomia');
