CREATE TYPE team_role AS ENUM ('administrador', 'operador', 'visualizador');

CREATE TABLE IF NOT EXISTS team_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  role team_role NOT NULL DEFAULT 'operador',
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TRIGGER team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura autenticada de membros"
  ON team_members FOR SELECT USING (true);

CREATE POLICY "Gestão autenticada de membros"
  ON team_members FOR ALL USING (auth.role() = 'authenticated');

-- Usuário inicial
INSERT INTO team_members (name, email, role) VALUES
  ('Administrador', 'admin@ieneassessoria.com.br', 'administrador');
