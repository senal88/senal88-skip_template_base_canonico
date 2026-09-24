import { CANONICAL_PROJECTS, DOMAINS, BACKEND_CONFIG } from '@/data/canonicalData'

export function exportCatalogMarkdown(): void {
  const dateStr = new Date().toISOString().split('T')[0]
  let md = `# Catálogo Canônico dos 33 Projetos Skip Cloud e Taxonomia\n\n`
  md += `> Gerado automaticamente pelo **Template Base Canônico** em ${dateStr}\n`
  md += `> Host Oficial: \`${BACKEND_CONFIG.host}\` | Porta: \`${BACKEND_CONFIG.port}\` | Coolify VPS: \`${BACKEND_CONFIG.coolifyVpsId}\`\n\n`

  md += `## 1. Padrão Canônico de Nomenclatura (SSOT)\n`
  md += `Todos os projetos seguem o formato: \`[dominio]__[slug_semantico]__[skip_uuid_curto]\`\n\n`

  Object.values(DOMAINS).forEach((d) => {
    md += `- **${d.code}__***: ${d.label} — ${d.descricao}\n`
  })

  md += `\n## 2. Inventário Completo e Mapeamento de Schemas (Seção 12)\n\n`
  md += `| ID Curto | Nome Original | Slug Padronizado | Domínio | Schema Supabase | Status | Upstream -> Downstream |\n`
  md += `|---|---|---|---|---|---|---|\n`

  CANONICAL_PROJECTS.forEach((p) => {
    md += `| \`${p.id}\` | ${p.nome} | \`${p.slug}\` | **${p.dominio}** | \`${p.schema}\` | ${p.status} | ${p.upstream} -> ${p.downstream} |\n`
  })

  md += `\n## 3. Conformidade Arquitetural (SYSTEM.md §12)\n\n`
  md += `- **Frontend:** Concebido e exportado pelo Skip Cloud e publicado em \`${BACKEND_CONFIG.productionDomainPattern}\`\n`
  md += `- **Backend:** Supabase Self-Hosted hospedado no Coolify da VPS (\`${BACKEND_CONFIG.coolifyVpsId}\`)\n`
  md += `- **Segregação Obrigatória:** Cada aplicação possui seu próprio schema isolado (\`skip_<slug>\`). O schema \`public\` nunca é utilizado.\n`
  md += `- **Buckets Padrão:** \`<schema>-public\` e \`<schema>-private\` com RLS mandatório.\n`

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `02_CATALOGO_E_TAXONOMIA_PROJETOS_${dateStr}.md`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function generateProjectSqlDdl(projectSlug: string): string {
  const project = CANONICAL_PROJECTS.find((p) => p.slug === projectSlug) || CANONICAL_PROJECTS[0]
  const schema = project.schema
  const prefix = schema.replace('skip_', '')

  return `-- =====================================================================
-- DDL DE ISOLAMENTO ESTRITO DE SCHEMA (SYSTEM.md §12)
-- Projeto: ${project.nome} (${project.id})
-- Schema Oficial: ${schema}
-- Host: ${BACKEND_CONFIG.host}:${BACKEND_CONFIG.port} (Supabase Self-Hosted)
-- VPS Coolify: ${BACKEND_CONFIG.coolifyVpsId}
-- Data de Geração: ${new Date().toISOString()}
-- =====================================================================

-- 1. Criação do Schema Dedicado
CREATE SCHEMA IF NOT EXISTS ${schema};

-- 2. Concessão de permissões estritas para roles do GoTrue
GRANT USAGE ON SCHEMA ${schema} TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA ${schema} GRANT ALL ON TABLES TO postgres, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA ${schema} GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA ${schema} GRANT SELECT ON TABLES TO anon;

-- 3. Tabela de Membros & Associação com app_id
CREATE TABLE IF NOT EXISTS ${schema}.${prefix}_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_id TEXT NOT NULL DEFAULT '${project.id}',
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    CONSTRAINT uq_${prefix}_membership UNIQUE (app_id, user_id)
);

-- Ativação Obrigatória de Row Level Security (RLS)
ALTER TABLE ${schema}.${prefix}_memberships ENABLE ROW LEVEL SECURITY;

-- 4. Tabela de Domínio Principal (${project.nome})
CREATE TABLE IF NOT EXISTS ${schema}.${prefix}_core (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_id TEXT NOT NULL DEFAULT '${project.id}',
    titulo TEXT NOT NULL,
    descricao TEXT,
    metadados JSONB DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'ativo',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

ALTER TABLE ${schema}.${prefix}_core ENABLE ROW LEVEL SECURITY;

-- 5. Tabela de Trilha de Auditoria
CREATE TABLE IF NOT EXISTS ${schema}.${prefix}_audit_log (
    id BIGSERIAL PRIMARY KEY,
    app_id TEXT NOT NULL DEFAULT '${project.id}',
    actor_id UUID REFERENCES auth.users(id),
    acao TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_origem INET,
    executado_em TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

ALTER TABLE ${schema}.${prefix}_audit_log ENABLE ROW LEVEL SECURITY;

-- 6. Políticas RLS: Isolamento Total (Bloqueio ao Schema Public)
CREATE POLICY "RLS: Membros autenticados acessam core"
    ON ${schema}.${prefix}_core
    FOR ALL
    TO authenticated
    USING (
        app_id = '${project.id}'
        AND EXISTS (
            SELECT 1 FROM ${schema}.${prefix}_memberships m
            WHERE m.app_id = '${project.id}'
              AND m.user_id = auth.uid()
        )
    );

CREATE POLICY "RLS: Membros visualizam membros"
    ON ${schema}.${prefix}_memberships
    FOR SELECT
    TO authenticated
    USING (
        app_id = '${project.id}'
        AND user_id = auth.uid()
    );

-- 7. Registro de Storage Buckets no padrão §12
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('${project.buckets.public}', '${project.buckets.public}', true, 10485760, ARRAY['image/png', 'image/jpeg', 'image/svg+xml', 'application/pdf']),
    ('${project.buckets.private}', '${project.buckets.private}', false, 52428800, NULL)
ON CONFLICT (id) DO NOTHING;

COMMENT ON SCHEMA ${schema} IS 'Schema canônico isolado para ${project.slug} - VPS Coolify';
`
}

export function generateProjectJson(projectSlug: string): string {
  const project = CANONICAL_PROJECTS.find((p) => p.slug === projectSlug) || CANONICAL_PROJECTS[0]

  const payload = {
    $schema: 'https://senamfo.com.br/schemas/skip-canonical-project.v1.json',
    meta: {
      exported_at: new Date().toISOString(),
      governance_version: 'v0.0.2',
      ssot_authority: 'SYSTEM.md §12',
    },
    app: {
      id: project.id,
      name: project.nome,
      slug: project.slug,
      domain: project.dominio,
      status: project.status,
      conforme_secao_12: project.conforme,
      canonical_url: `https://${project.id}.mfotrust.com`,
      description: project.descricao,
    },
    backend: {
      provider: 'supabase_self_hosted',
      host: BACKEND_CONFIG.host,
      port: BACKEND_CONFIG.port,
      database: BACKEND_CONFIG.database,
      schema: project.schema,
      isolation_mode: 'strict_schema',
      coolify_vps_id: BACKEND_CONFIG.coolifyVpsId,
      ssl_mode: BACKEND_CONFIG.sslMode,
      anon_key_masked: BACKEND_CONFIG.anonKeyMasked,
      db_password_masked: BACKEND_CONFIG.passwordMasked,
    },
    storage: {
      buckets: [
        { name: project.buckets.public, public: true, size_limit_mb: 10 },
        { name: project.buckets.private, public: false, size_limit_mb: 50 },
      ],
    },
    telemetry: {
      tables_count: project.tabelasEstimadas,
      estimated_rows: project.registrosEstimados,
      upstream: project.upstream,
      downstream: project.downstream,
    },
    security: {
      rls_enforced: true,
      public_schema_data_allowed: false,
      auth_membership_model: 'gotrue_app_id',
    },
  }

  return JSON.stringify(payload, null, 2)
}

export function generateProjectYaml(projectSlug: string): string {
  const project = CANONICAL_PROJECTS.find((p) => p.slug === projectSlug) || CANONICAL_PROJECTS[0]

  return `# Manifest Declarativo Skip Cloud -> Supabase Self-Hosted
# Destino: glob_00_skip/backends/supabase/apps/${project.id}.yaml
# Autoridade: SYSTEM.md §12 (SSOT)

app:
  id: "${project.id}"
  name: "${project.nome}"
  slug: "${project.slug}"
  domain: "${project.dominio}"
  environment: "production"
  canonical_url: "https://${project.id}.mfotrust.com"

backend:
  provider: "supabase_self_hosted"
  host: "${BACKEND_CONFIG.host}"
  port: ${BACKEND_CONFIG.port}
  database: "${BACKEND_CONFIG.database}"
  schema: "${project.schema}"
  isolation_mode: "strict_schema"

storage:
  buckets:
    - name: "${project.buckets.public}"
      public: true
      file_size_limit: 10485760 # 10MB
      allowed_mime_types: ["image/*", "application/pdf"]
    - name: "${project.buckets.private}"
      public: false
      file_size_limit: 52428800 # 50MB
      allowed_mime_types: ["*/*"]

security:
  rls_enforced: true
  auth_mode: "gotrue_app_id"
  roles:
    - name: "admin"
      permissions: ["select", "insert", "update", "delete"]
    - name: "editor"
      permissions: ["select", "insert", "update"]
    - name: "viewer"
      permissions: ["select"]
  membership_predicate: "app_id = '${project.id}' AND auth.uid() IN (SELECT user_id FROM ${project.schema}.memberships)"

pipeline:
  upstream: "${project.upstream}"
  downstream: "${project.downstream}"
  coolify_resource: "${BACKEND_CONFIG.coolifyVpsId}"
  status: "${project.status}"
  validation_command: "make validate APP=${project.id}"
`
}
