export type DomainCode = 'mfo' | 'legal' | 'agent' | 'comm' | 'tpl'

export type ProjectStatus = 'Live' | 'Validado' | 'Protótipo'

export interface ProjectCanonical {
  id: string // e.g. 'f5b6d759'
  nome: string
  slug: string
  dominio: DomainCode
  schema: string
  upstream: string
  downstream: string
  status: ProjectStatus
  conforme: boolean // Seção 12: frontend Skip + backend Supabase isolado por schema
  descricao?: string
  tabelasEstimadas: number
  registrosEstimados: number
  buckets: {
    public: string
    private: string
  }
}

export interface DomainMeta {
  code: DomainCode
  label: string
  descricao: string
  colorBadge: string // Tailwind classes
  badgeBg: string
  dotColor: string
  hex: string
}

export interface ActivityEvent {
  id: string
  timestamp: string
  tipo: 'intake' | 'schema' | 'promocao' | 'health' | 'drift'
  titulo: string
  descricao: string
  status: 'Live' | 'Validado' | 'Protótipo' | 'Drift' | 'Healthy'
  dominio?: DomainCode
}

export interface SchemaTelemetry {
  schema: string
  projetoNome: string
  projetoSlug: string
  dominio: DomainCode
  tableCount: number
  rowCount: number
  health: 'Healthy' | 'Warning' | 'Drift'
  tabelas: { nome: string; linhas: number; colunas: number }[]
}
