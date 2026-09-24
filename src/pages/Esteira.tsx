import { useState, useId } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  GitBranch,
  FileCode,
  Copy,
  Download,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FolderArchive,
  RefreshCw,
  Terminal,
  Send,
} from 'lucide-react'
import { CANONICAL_PROJECTS, DOMAINS, BACKEND_CONFIG } from '@/data/canonicalData'
import { DomainCode } from '@/data/types'
import { generateProjectYaml, exportCatalogMarkdown } from '@/lib/exportUtils'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Esteira() {
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') === 'exports' ? 'exports' : 'intake'
  const preSelectedProjectSlug = searchParams.get('projeto') || CANONICAL_PROJECTS[0].slug

  const [activeTab, setActiveTab] = useState<'intake' | 'exports'>(initialTab)

  // FORMULÁRIO DE INTAKE
  const [nomeProduto, setNomeProduto] = useState('')
  const [dominio, setDominio] = useState<DomainCode>('mfo')
  const [objetivo, setObjetivo] = useState('')
  const [schemaManual, setSchemaManual] = useState('')
  const [roles, setRoles] = useState({
    admin: true,
    editor: true,
    viewer: true,
  })
  const [submittingIntake, setSubmittingIntake] = useState(false)

  // Gerar auto schema a partir do nome
  const autoSchema = nomeProduto
    ? `skip_${nomeProduto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 24)}`
    : 'skip_nome_do_produto'

  const effectiveSchema = schemaManual || autoSchema
  const bucketPublic = `${effectiveSchema}-public`
  const bucketPrivate = `${effectiveSchema}-private`

  const handleRegisterProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nomeProduto.trim()) {
      toast.error('Informe o nome do produto.')
      return
    }

    setSubmittingIntake(true)
    setTimeout(() => {
      setSubmittingIntake(false)
      toast.success(`Projeto "${nomeProduto}" registrado no catálogo canônico!`, {
        description: `Schema gerado: ${effectiveSchema} | Buckets: ${bucketPublic}, ${bucketPrivate}`,
      })
      setNomeProduto('')
      setObjetivo('')
      setSchemaManual('')
    }, 800)
  }

  // ABA DE EXPORTS
  const [selectedExportSlug, setSelectedExportSlug] = useState<string>(preSelectedProjectSlug)
  const currentExportProject =
    CANONICAL_PROJECTS.find((p) => p.slug === selectedExportSlug) || CANONICAL_PROJECTS[0]

  const yamlContent = generateProjectYaml(currentExportProject.slug)

  const handleCopyYaml = () => {
    navigator.clipboard.writeText(yamlContent)
    toast.success('Manifesto YAML copiado para a área de transferência!')
  }

  const handleDownloadYaml = () => {
    const blob = new Blob([yamlContent], { type: 'text/yaml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentExportProject.id}.yaml`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(`Manifesto ${currentExportProject.id}.yaml baixado!`)
  }

  const handleExportCatalog = () => {
    exportCatalogMarkdown()
    toast.success('Catálogo Completo em Markdown baixado com sucesso!')
  }

  // CHECKLIST DE PROMOÇÃO (4 ITENS OBRIGATÓRIOS)
  const [checklist, setChecklist] = useState({
    mocks: false,
    coolifyVars: false,
    routeDomain: false,
    makeValidate: false,
  })

  const checklistItems = [
    {
      key: 'mocks' as const,
      label: 'Remoção completa de mocks e credenciais de builder',
      subtext: 'Nenhuma chave anon ou secrets de ambiente expostas no código cliente',
    },
    {
      key: 'coolifyVars' as const,
      label: 'Configuração das variáveis no Coolify (cprz78e8mogdugpyjwpe2maw)',
      subtext: 'SUPABASE_URL, SUPABASE_ANON_KEY e APP_ID injetados no container',
    },
    {
      key: 'routeDomain' as const,
      label: `Apontamento de rota produtiva para https://${currentExportProject.id}.mfotrust.com`,
      subtext: 'CNAME configurado no DNS Cloudflare com SSL full strict',
    },
    {
      key: 'makeValidate' as const,
      label: 'Execução de make validate no glob_00_skip',
      subtext: 'Validação de schema isolation, linter de manifests e policies de RLS',
    },
  ]

  const totalChecklist = checklistItems.length
  const completedChecklist = Object.values(checklist).filter(Boolean).length
  const progressPercent = Math.round((completedChecklist / totalChecklist) * 100)
  const is100Percent = progressPercent === 100

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-50 text-sky-800 border border-sky-200 uppercase tracking-wider">
              Esteira de Replicabilidade &bull; SSOT
            </span>
            <span className="text-xs text-slate-400 font-mono">Entradas &amp; Saídas</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Esteira de Intake / Exports
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-3xl">
            Padronização de entrada de novos projetos Skip Cloud e exportação de manifestos
            declarativos YAML para promoção na VPS Coolify (
            <code className="font-mono text-sky-800">{BACKEND_CONFIG.coolifyVpsId}</code>).
          </p>
        </div>

        {/* Action Right */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handleExportCatalog}
            variant="outline"
            className="border-slate-200 text-slate-700 hover:bg-slate-100 shadow-xs text-xs font-semibold gap-2"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            Exportar Catálogo Markdown
          </Button>
        </div>
      </div>

      {/* Navegação por Abas: Intake / Exports */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as 'intake' | 'exports')}
        className="space-y-6"
      >
        <TabsList className="bg-slate-100 p-1 border border-slate-200 rounded-lg">
          <TabsTrigger
            value="intake"
            className="text-xs font-semibold px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-sky-800 data-[state=active]:shadow-xs"
          >
            Intake (Entradas)
          </TabsTrigger>
          <TabsTrigger
            value="exports"
            className="text-xs font-semibold px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-sky-800 data-[state=active]:shadow-xs"
          >
            Exports (Saídas &amp; Promoção)
          </TabsTrigger>
        </TabsList>

        {/* ==================================================================== */}
        {/* ABA 1: INTAKE (ENTRADAS) */}
        {/* ==================================================================== */}
        <TabsContent value="intake" className="space-y-6 focus:outline-hidden">
          <form onSubmit={handleRegisterProject}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Coluna 1 & 2: Formulário Guiado */}
              <div className="lg:col-span-2 space-y-6">
                {/* Seção 1: Identificação */}
                <Card className="bg-white border-slate-200 shadow-xs">
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-sky-700 text-white text-[11px] flex items-center justify-center font-bold">
                        1
                      </span>
                      Identificação do Produto
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      Nome oficial, domínio canônico de classificação e escopo operacional
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Nome do Produto <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        value={nomeProduto}
                        onChange={(e) => setNomeProduto(e.target.value)}
                        placeholder="Ex: Simulador de Holding Imobiliária"
                        className="bg-slate-50 border-slate-200 text-xs focus:bg-white focus:border-sky-700 focus:ring-2 focus:ring-sky-700/20"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Domínio Pretendido
                        </label>
                        <select
                          value={dominio}
                          onChange={(e) => setDominio(e.target.value as DomainCode)}
                          className="w-full text-xs h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-md font-medium text-slate-800 focus:outline-hidden focus:border-sky-700 focus:ring-2 focus:ring-sky-700/20"
                        >
                          {Object.values(DOMAINS).map((d) => (
                            <option key={d.code} value={d.code}>
                              {d.label} ({d.code}__*)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Prefixo Canônico Gerado
                        </label>
                        <div className="h-9 px-3 bg-slate-100 border border-slate-200 rounded-md text-xs font-mono text-slate-700 flex items-center">
                          {dominio}__{nomeProduto ? autoSchema.replace('skip_', '') : '<slug>'}
                          __&lt;uuid&gt;
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Objetivo Funcional &amp; Escopo
                      </label>
                      <textarea
                        value={objetivo}
                        onChange={(e) => setObjetivo(e.target.value)}
                        rows={3}
                        placeholder="Descreva as responsabilidades da aplicação, integrações externas e público atendido..."
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-sky-700 focus:ring-2 focus:ring-sky-700/20"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Seção 2: Schema Target (Postgres) */}
                <Card className="bg-white border-slate-200 shadow-xs">
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-sky-700 text-white text-[11px] flex items-center justify-center font-bold">
                        2
                      </span>
                      Schema Target (Supabase Self-Hosted)
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      Isolamento estrito conforme SYSTEM.md §12 — o schema public nunca armazena
                      dados de produto
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-slate-700">
                          Nome do Schema em Postgres (skip_&lt;slug&gt;)
                        </label>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Auto-gerado &bull; Editável
                        </span>
                      </div>
                      <Input
                        value={schemaManual || autoSchema}
                        onChange={(e) => setSchemaManual(e.target.value)}
                        placeholder="skip_nome_do_produto"
                        className="bg-slate-50 font-mono text-xs text-sky-900 font-semibold border-slate-200 focus:bg-white focus:border-sky-700 focus:ring-2 focus:ring-sky-700/20"
                      />
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        Script DDL aplicará:{' '}
                        <code className="font-mono text-slate-700 font-semibold">
                          CREATE SCHEMA IF NOT EXISTS {effectiveSchema};
                        </code>
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Seção 3: Contrato de Membros & RLS */}
                <Card className="bg-white border-slate-200 shadow-xs">
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-sky-700 text-white text-[11px] flex items-center justify-center font-bold">
                        3
                      </span>
                      Contrato de Membros &amp; Políticas RLS
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      Permissões baseadas em app_id e roles autenticadas do GoTrue
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    <div className="space-y-2">
                      <label className="flex items-start gap-2.5 p-2.5 rounded-md border border-slate-200 bg-slate-50/60 cursor-pointer hover:bg-slate-50">
                        <input
                          type="checkbox"
                          checked={roles.admin}
                          onChange={(e) => setRoles({ ...roles, admin: e.target.checked })}
                          className="mt-0.5 rounded text-sky-700 focus:ring-sky-700"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-800">Role: admin</span>
                          <p className="text-[11px] text-slate-500">
                            Acesso irrestrito às tabelas do schema{' '}
                            <code className="font-mono">{effectiveSchema}</code> (SELECT, INSERT,
                            UPDATE, DELETE).
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-2.5 p-2.5 rounded-md border border-slate-200 bg-slate-50/60 cursor-pointer hover:bg-slate-50">
                        <input
                          type="checkbox"
                          checked={roles.editor}
                          onChange={(e) => setRoles({ ...roles, editor: e.target.checked })}
                          className="mt-0.5 rounded text-sky-700 focus:ring-sky-700"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-800">Role: editor</span>
                          <p className="text-[11px] text-slate-500">
                            Permissão de leitura e escrita colaborativa nas tabelas de dados de
                            negócio.
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-2.5 p-2.5 rounded-md border border-slate-200 bg-slate-50/60 cursor-pointer hover:bg-slate-50">
                        <input
                          type="checkbox"
                          checked={roles.viewer}
                          onChange={(e) => setRoles({ ...roles, viewer: e.target.checked })}
                          className="mt-0.5 rounded text-sky-700 focus:ring-sky-700"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-800">Role: viewer</span>
                          <p className="text-[11px] text-slate-500">
                            Acesso somente leitura condicionado ao predicado{' '}
                            <code className="font-mono">app_id</code>.
                          </p>
                        </div>
                      </label>
                    </div>
                  </CardContent>
                </Card>

                {/* Seção 4: Armazenamento (Buckets) */}
                <Card className="bg-white border-slate-200 shadow-xs">
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-sky-700 text-white text-[11px] flex items-center justify-center font-bold">
                        4
                      </span>
                      Armazenamento (Buckets Mandatórios)
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      Dois buckets criados automaticamente por schema: público e privado
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex flex-col justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 font-sans">
                          Bucket Público
                        </span>
                        <span className="text-slate-900 font-semibold mt-1 truncate">
                          {bucketPublic}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1 font-sans">
                          Imagens, logos e assets públicos
                        </span>
                      </div>

                      <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex flex-col justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 font-sans">
                          Bucket Privado
                        </span>
                        <span className="text-slate-900 font-semibold mt-1 truncate">
                          {bucketPrivate}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1 font-sans">
                          Laudos fiduciários, PDFs e dossiês
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={submittingIntake}
                    className="bg-sky-700 hover:bg-sky-800 text-white font-semibold text-xs gap-2 px-6 h-10 shadow-xs"
                  >
                    <Send className={`w-3.5 h-3.5 ${submittingIntake ? 'animate-bounce' : ''}`} />
                    {submittingIntake ? 'Registrando Projeto...' : 'Registrar Projeto no Catálogo'}
                  </Button>
                </div>
              </div>

              {/* Coluna 3: Preview do Intake & Diretrizes */}
              <div className="space-y-4">
                <Card className="bg-white border-slate-200 shadow-xs">
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Resumo da Validação
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3 text-xs">
                    <div className="space-y-2">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Ambiente:</span>
                        <span className="font-semibold text-slate-800">Coolify VPS (PRD)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Host Supabase:</span>
                        <span className="font-mono text-slate-800">{BACKEND_CONFIG.host}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Porta:</span>
                        <span className="font-mono text-slate-800">{BACKEND_CONFIG.port}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Segregação:</span>
                        <span className="text-emerald-700 font-semibold">100% Schema Isolado</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-sky-50 border border-sky-200 text-sky-900 space-y-1 mt-4">
                      <span className="font-bold text-[11px] block">Próximos Passos:</span>
                      <p className="text-[11px] leading-relaxed">
                        Após o registro, acesse a aba <strong>Exports</strong> para gerar o
                        manifesto declarativo YAML correspondente para a pasta{' '}
                        <code className="font-mono">glob_00_skip/apps/</code>.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Card de Regras SYSTEM.md */}
                <Card className="bg-slate-900 text-slate-200 border-slate-800 shadow-xs text-xs font-mono">
                  <CardHeader className="pb-2 border-b border-slate-800">
                    <CardTitle className="text-xs font-semibold text-white flex items-center gap-1.5 font-sans">
                      <Terminal className="w-3.5 h-3.5 text-sky-400" />
                      Regra Suprema §12
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-3 space-y-2 text-[11px] leading-relaxed">
                    <p className="text-slate-300">
                      - Todo app deve apontar para https://&lt;id&gt;.mfotrust.com
                    </p>
                    <p className="text-slate-300">
                      - Schema public é proibido para dados de produto
                    </p>
                    <p className="text-slate-300">- RLS mandatório em todas as tabelas</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </TabsContent>

        {/* ==================================================================== */}
        {/* ABA 2: EXPORTS & PROMOÇÃO */}
        {/* ==================================================================== */}
        <TabsContent value="exports" className="space-y-6 focus:outline-hidden">
          {/* Seletor de Projeto para Exportar */}
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-sky-700" />
                    Gerador de Manifesto Declarativo YAML
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Gere o artefato de infraestrutura para implantação no pipeline oficial
                    glob_00_skip
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleCopyYaml}
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs border-slate-200 hover:bg-slate-50 gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-600" />
                    Copiar YAML
                  </Button>
                  <Button
                    onClick={handleDownloadYaml}
                    size="sm"
                    className="h-8 text-xs bg-sky-700 hover:bg-sky-800 text-white font-semibold gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Baixar {currentExportProject.id}.yaml
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {/* Dropdown de Seleção de Projeto */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                  Selecione o Projeto do Catálogo:
                </label>
                <select
                  value={selectedExportSlug}
                  onChange={(e) => setSelectedExportSlug(e.target.value)}
                  className="w-full sm:w-96 text-xs h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-md font-medium text-slate-800 focus:outline-hidden focus:border-sky-700"
                >
                  {CANONICAL_PROJECTS.map((p) => (
                    <option key={p.id} value={p.slug}>
                      [{p.dominio.toUpperCase()}] {p.nome} ({p.id})
                    </option>
                  ))}
                </select>
                <span className="text-xs text-slate-500 font-mono">
                  Schema: <strong className="text-sky-900">{currentExportProject.schema}</strong>
                </span>
              </div>

              {/* Preview Monospace do YAML */}
              <div className="relative">
                <div className="absolute right-3 top-3 z-10 text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  YAML &bull; UTF-8
                </div>
                <pre className="p-4 rounded-lg bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto h-80 border border-slate-800 leading-relaxed">
                  {yamlContent}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* CHECKLIST DE PROMOÇÃO (4 ITENS OBRIGATÓRIOS) */}
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Checklist de Promoção para Produção
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Etapas obrigatórias antes da publicação em{' '}
                    {BACKEND_CONFIG.productionDomainPattern}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-slate-700">
                    {completedChecklist} de {totalChecklist} concluídos
                  </span>
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
                    {progressPercent}%
                  </span>
                </div>
              </div>

              {/* Barra de Progresso Animada */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
                <div
                  className={`h-full transition-all duration-400 ease-out ${
                    is100Percent ? 'bg-emerald-500' : 'bg-sky-700'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              {/* Banner de Sucesso 100% */}
              {is100Percent && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-fade-in font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Todas as validações completadas! O projeto está pronto para homologação
                    produtiva na VPS Coolify (
                    <code className="font-mono">{BACKEND_CONFIG.coolifyVpsId}</code>).
                  </span>
                </div>
              )}

              {/* Lista dos 4 Itens */}
              <div className="space-y-2.5">
                {checklistItems.map((item) => {
                  const isChecked = checklist[item.key]
                  return (
                    <label
                      key={item.key}
                      className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-slate-50/80 border-slate-200'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const next = { ...checklist, [item.key]: e.target.checked }
                          setChecklist(next)
                          if (e.target.checked) {
                            toast.success(`Item marcado: ${item.label}`)
                          }
                        }}
                        className="mt-0.5 w-4 h-4 rounded text-sky-700 focus:ring-sky-700"
                      />
                      <div className="flex-1 text-xs">
                        <span
                          className={`font-semibold transition-all ${
                            isChecked ? 'line-through text-slate-400' : 'text-slate-800'
                          }`}
                        >
                          {item.label}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5 font-sans">
                          {item.subtext}
                        </p>
                      </div>
                      {isChecked && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                    </label>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
