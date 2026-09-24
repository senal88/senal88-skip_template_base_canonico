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
