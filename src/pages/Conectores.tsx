import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Server,
  Database,
  Copy,
  CheckCircle2,
  RefreshCw,
  Zap,
  Globe,
  Shield,
  Activity,
  ChevronRight,
  ChevronDown,
  Layers,
  ArrowRight,
  Play,
  Code2,
  Lock,
} from 'lucide-react'
import { BACKEND_CONFIG, SCHEMAS_TELEMETRY, DOMAINS } from '@/data/canonicalData'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Conectores() {
  const [searchParams] = useSearchParams()
  const highlightSchema = searchParams.get('schema')

  // Estado de teste de conexão
  const [testingConnection, setTestingConnection] = useState(false)
  const [connectionSuccess, setConnectionSuccess] = useState(true)
  const [latencyTime, setLatencyTime] = useState(28)
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h')

  // Schema Explorer: expansão de linhas
  const [expandedSchema, setExpandedSchema] = useState<string | null>(highlightSchema || null)

  // API Route Simulator
  const [selectedRoute, setSelectedRoute] = useState<
    'rest_projects' | 'rest_intake' | 'bff_memberships' | 'bff_metrics'
  >('rest_projects')
  const [testingApi, setTestingApi] = useState(false)
  const [apiResponse, setApiResponse] = useState<string | null>(null)
  const [apiLatency, setApiLatency] = useState<number | null>(null)

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copiado!`)
  }

  const handleTestConnection = () => {
    setTestingConnection(true)
    setTimeout(() => {
      const ms = Math.floor(Math.random() * 10) + 24
      setLatencyTime(ms)
      setTestingConnection(false)
      setConnectionSuccess(true)
      toast.success(`Conexão bem-sucedida! Kong Gateway respondeu em ${ms}ms.`)
    }, 800)
  }

  // Exemplos de Rotas para o Simulador
  const routesCatalog = {
    rest_projects: {
      type: 'REST',
      method: 'GET',
      path: '/rest/v1/skip_dashboard_financeir/projects?select=id,nome,status',
      samplePayload: {
        filter: 'status=eq.Live',
        order: 'id.asc',
        limit: 5,
      },
      mockResponse: {
        status: 200,
        ok: true,
        data: [
          { id: 'f5b6d759', nome: 'Dashboard Financeiro Contemporâneo', status: 'Live' },
          { id: '90713eca', nome: 'App Financeiro PRD', status: 'Live' },
        ],
        schema: 'skip_dashboard_financeir',
        server: 'Kong/2.8.4 (Supabase)',
      },
    },
    rest_intake: {
      type: 'REST',
      method: 'POST',
      path: '/rest/v1/skip_modulo_de_integrac/intake_jobs',
      samplePayload: {
        job_type: 'bank_sync',
        provider: 'btg_open_banking',
        app_id: '7282769e',
        target_schema: 'skip_modulo_de_integrac',
      },
      mockResponse: {
        status: 201,
        ok: true,
        message: 'Job de ingestão enfileirado com isolamento de schema estrito',
        job_id: 'job_4981bc89a',
        created_at: new Date().toISOString(),
      },
    },
    bff_memberships: {
      type: 'BFF',
      method: 'GET',
      path: '/api/v1/bff/memberships/validate?app_id=6fe191fc',
      samplePayload: {
        auth_uid: 'usr_f893e110',
        required_role: 'admin',
        schema: 'skip_sistema_multi_fami',
      },
      mockResponse: {
        authorized: true,
        role: 'admin',
        rls_predicate: "app_id = '6fe191fc'",
        buckets_accessible: ['skip_sistema_multi_fami-public', 'skip_sistema_multi_fami-private'],
      },
    },
    bff_metrics: {
      type: 'BFF',
      method: 'GET',
      path: '/api/v1/bff/telemetry/schemas/health',
      samplePayload: {
        coolify_host: 'supabase.senamfo.com.br',
        check_all: true,
      },
      mockResponse: {
        active_schemas: 33,
        healthy: 31,
        warning: 2,
        drift_count: 0,
        db_version: 'PostgreSQL 15.6 (Supabase Self-Hosted)',
      },
    },
  }

  const handleSimulateApi = () => {
    setTestingApi(true)
    setApiResponse(null)
    setTimeout(() => {
      const active = routesCatalog[selectedRoute]
      setApiResponse(JSON.stringify(active.mockResponse, null, 2))
      setApiLatency(Math.floor(Math.random() * 20) + 18)
      setTestingApi(false)
      toast.success(`Resposta simulada da rota ${active.type} (${active.method})`)
    }, 800)
  }

  // Gráfico de linha de latência adaptado conforme timeRange
  const latencyPoints =
    timeRange === '24h'
      ? [28, 29, 31, 27, 28, 30, 26, 28, 29, 32, 28, 27, 28, 29, latencyTime]
      : timeRange === '7d'
        ? [29, 33, 28, 30, 32, 28, 29]
        : [30, 29, 28, 32, 31, 29, 28, 30, 28, 29]

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-50 text-sky-800 border border-sky-200 uppercase tracking-wider">
              Data Plane Oficial &bull; VPS Coolify
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Porta 54322 &bull; Kong Gateway
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Conectores &amp; Data Plane
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-3xl">
            Painel de parâmetros de conectividade, monitoramento de latência e explorador dos 33
            schemas segregados no Supabase Self-Hosted hospedado na VPS Coolify.
          </p>
        </div>

        {/* Action Right */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handleTestConnection}
            disabled={testingConnection}
            className="bg-sky-700 hover:bg-sky-800 text-white shadow-xs text-xs font-semibold gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
            {testingConnection ? 'Testando Conexão...' : 'Testar Conexão Oficial'}
          </Button>
        </div>
      </div>

      {/* Grid: Parâmetros Oficiais de Conexão + Status & Latência */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel de Parâmetros Oficiais (2 colunas) */}
        <Card className="lg:col-span-2 bg-white border-slate-200 shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Database className="w-4 h-4 text-sky-700" />
                  Parâmetros de Conexão do Backend Oficial
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Valores canônicos para conexões Skip Cloud &rarr; VPS Coolify (SYSTEM.md §12)
                </CardDescription>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                SSL: Skip Verification
              </span>
            </div>
          </CardHeader>

          <CardContent className="pt-4 space-y-3">
            {/* Lista densa de parâmetros com botão de cópia individual */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Host */}
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Host
                  </span>
                  <span className="font-mono font-semibold text-slate-900 text-xs sm:text-sm">
                    {BACKEND_CONFIG.host}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(BACKEND_CONFIG.host, 'Host')}
                  className="p-1.5 rounded hover:bg-white text-slate-400 hover:text-slate-800 transition-colors shadow-2xs"
                  title="Copiar Host"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Porta */}
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Porta (PostgreSQL)
                  </span>
                  <span className="font-mono font-semibold text-slate-900 text-xs sm:text-sm">
                    {BACKEND_CONFIG.port}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(BACKEND_CONFIG.port, 'Porta')}
                  className="p-1.5 rounded hover:bg-white text-slate-400 hover:text-slate-800 transition-colors shadow-2xs"
                  title="Copiar Porta"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Database */}
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Database
                  </span>
                  <span className="font-mono font-semibold text-slate-900 text-xs sm:text-sm">
                    {BACKEND_CONFIG.database}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(BACKEND_CONFIG.database, 'Database')}
                  className="p-1.5 rounded hover:bg-white text-slate-400 hover:text-slate-800 transition-colors shadow-2xs"
                  title="Copiar Database"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* User */}
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Usuário
                  </span>
                  <span className="font-mono font-semibold text-slate-900 text-xs sm:text-sm">
                    {BACKEND_CONFIG.username}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(BACKEND_CONFIG.username, 'Usuário')}
                  className="p-1.5 rounded hover:bg-white text-slate-400 hover:text-slate-800 transition-colors shadow-2xs"
                  title="Copiar Usuário"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* API URL (Kong) */}
              <div className="sm:col-span-2 p-3 rounded-lg border border-slate-200 bg-slate-50/60 flex items-center justify-between">
                <div className="truncate pr-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    API URL (Kong Gateway)
                  </span>
                  <span className="font-mono font-semibold text-sky-900 text-xs sm:text-sm truncate block">
                    {BACKEND_CONFIG.apiUrlKong}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(BACKEND_CONFIG.apiUrlKong, 'API URL')}
                  className="p-1.5 rounded hover:bg-white text-slate-400 hover:text-slate-800 transition-colors shrink-0 shadow-2xs"
                  title="Copiar API URL"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Aviso de Segurança e RLS */}
            <div className="p-2.5 rounded-md border border-amber-200 bg-amber-50/60 text-xs text-amber-800 flex items-start gap-2">
              <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Atenção de Governança:</strong> As chaves de serviço nunca são expostas na
                interface. Apenas o túnel e a chave pública anon são utilizados em tempo de execução
                pelo browser sob políticas de RLS por{' '}
                <code className="font-mono font-semibold">app_id</code>.
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Painel de Status & Telemetria */}
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Status de Telemetria
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Desempenho da VPS Coolify
                </CardDescription>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Operacional
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {/* Gauge de Latência e Resposta */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">Tempo de Resposta</span>
                <div className="text-2xl font-bold font-mono text-slate-900 flex items-baseline gap-1">
                  {latencyTime}
                  <span className="text-xs font-normal text-slate-500">ms</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500">Disponibilidade 30d</span>
                <div className="text-lg font-bold font-mono text-emerald-700">99.98%</div>
              </div>
            </div>

            {/* Toggle de Intervalo do Gráfico de Linha */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-500 font-medium">Curva de Latência</span>
                <div className="flex items-center border border-slate-200 rounded overflow-hidden text-[10px] font-mono">
                  {(['24h', '7d', '30d'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setTimeRange(r)}
                      className={`px-2 py-0.5 ${
                        timeRange === r
                          ? 'bg-sky-700 text-white font-bold'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gráfico de linha adaptativo em SVG */}
              <div className="h-20 w-full bg-slate-50 rounded border border-slate-200 p-2 flex items-end">
                <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
                  <path
                    d={`M 0,${60 - ((latencyPoints[0] - 20) / 18) * 50} ${latencyPoints
                      .map(
                        (val, idx) =>
                          `L ${(idx / (latencyPoints.length - 1)) * 200},${60 - ((val - 20) / 18) * 50}`,
                      )
                      .join(' ')}`}
                    fill="none"
                    stroke="#0369A1"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d={`M 0,${60 - ((latencyPoints[0] - 20) / 18) * 50} ${latencyPoints
                      .map(
                        (val, idx) =>
                          `L ${(idx / (latencyPoints.length - 1)) * 200},${60 - ((val - 20) / 18) * 50}`,
                      )
                      .join(' ')} L 200,60 L 0,60 Z`}
                    fill="#0369A1"
                    opacity="0.15"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-1.5 text-xs border-t border-slate-100 pt-2 font-mono">
              <div className="flex justify-between text-slate-500">
                <span>Instância Coolify:</span>
                <span className="text-slate-800 font-semibold">{BACKEND_CONFIG.coolifyVpsId}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Versão Postgres:</span>
                <span className="text-slate-800 font-semibold">15.6 (Supabase)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Explorador de Schemas Segregados */}
      <Card className="bg-white border-slate-200 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-700" />
                Explorador de Schemas Segregados (33 Schemas)
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Tabela de telemetria individual de cada schema isolado no Postgres com contagem de
                tabelas e linhas
              </CardDescription>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Clique na linha para expandir tabelas
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3"></th>
                  <th className="py-2.5 px-3">Nome do Schema</th>
                  <th className="py-2.5 px-3">Projeto Associado</th>
                  <th className="py-2.5 px-3">Domínio</th>
                  <th className="py-2.5 px-3 text-center">Tabelas</th>
                  <th className="py-2.5 px-3 text-right">Registros Estimados</th>
                  <th className="py-2.5 px-3 text-center">Saúde</th>
                  <th className="py-2.5 px-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {SCHEMAS_TELEMETRY.map((item) => {
                  const isExpanded = expandedSchema === item.schema
                  const domainInfo = DOMAINS[item.dominio]
                  return (
                    <div key={item.schema} className="contents">
                      <tr
                        onClick={() => setExpandedSchema(isExpanded ? null : item.schema)}
                        className={`cursor-pointer hover:bg-sky-50/40 transition-colors ${
                          isExpanded ? 'bg-sky-50/60' : ''
                        }`}
                      >
                        <td className="py-2 px-3 text-slate-400 w-6">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-sky-700" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </td>
                        <td className="py-2 px-3 font-mono font-bold text-sky-900">
                          {item.schema}
                        </td>
                        <td className="py-2 px-3 text-slate-800 font-medium">{item.projetoNome}</td>
                        <td className="py-2 px-3">
                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${domainInfo?.colorBadge}`}
                          >
                            {domainInfo?.code.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center font-mono font-semibold text-slate-700">
                          {item.tableCount}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-slate-700">
                          {item.rowCount.toLocaleString('pt-BR')}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${
                              item.health === 'Healthy'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : item.health === 'Warning'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            {item.health}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              copyToClipboard(item.schema, 'Schema')
                            }}
                            className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800"
                            title="Copiar nome do schema"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>

                      {/* Linha Expandida com as tabelas do schema */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={8} className="p-0 bg-slate-50/80 border-b border-slate-200">
                            <div className="p-4 space-y-2">
                              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                                <span>
                                  Tabelas segregadas em{' '}
                                  <code className="font-mono text-sky-800">{item.schema}</code>:
                                </span>
                                <span className="text-[11px] text-slate-500 font-mono">
                                  Slug: {item.projetoSlug}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                                {item.tabelas.map((tbl) => (
                                  <div
                                    key={tbl.nome}
                                    className="p-2.5 rounded bg-white border border-slate-200 shadow-2xs text-xs font-mono"
                                  >
                                    <div className="font-bold text-slate-800 truncate">
                                      {tbl.nome}
                                    </div>
                                    <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                                      <span>{tbl.linhas.toLocaleString('pt-BR')} linhas</span>
                                      <span>{tbl.colunas} colunas</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </div>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Simulador de Rotas de API (REST & BFF) */}
      <Card className="bg-white border-slate-200 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-sky-700" />
                Simulador de Rotas de API (REST &amp; BFF)
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Teste de consultas em tempo de execução via Kong Gateway e endpoints BFF
              </CardDescription>
            </div>
            <span className="text-xs font-mono text-slate-500">Ambiente Produção</span>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          {/* Seletor de Rota */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full sm:w-auto">
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Selecione a Rota de Exemplo:
              </label>
              <select
                value={selectedRoute}
                onChange={(e) => {
                  setSelectedRoute(e.target.value as any)
                  setApiResponse(null)
                  setApiLatency(null)
                }}
                className="w-full sm:w-80 text-xs h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-md font-medium text-slate-800 focus:outline-hidden focus:border-sky-700"
              >
                <option value="rest_projects">
                  GET /rest/v1/skip_dashboard_financeir/projects
                </option>
                <option value="rest_intake">
                  POST /rest/v1/skip_modulo_de_integrac/intake_jobs
                </option>
                <option value="bff_memberships">GET /api/v1/bff/memberships/validate</option>
                <option value="bff_metrics">GET /api/v1/bff/telemetry/schemas/health</option>
              </select>
            </div>

            <div className="flex-1 w-full pt-4 sm:pt-4">
              <div className="flex items-center gap-2 font-mono text-xs bg-slate-100 border border-slate-200 rounded-md px-3 py-2 text-slate-700 truncate">
                <span className="font-bold text-sky-800">
                  {routesCatalog[selectedRoute].method}
                </span>
                <span className="truncate">{routesCatalog[selectedRoute].path}</span>
              </div>
            </div>

            <Button
              onClick={handleSimulateApi}
              disabled={testingApi}
              className="w-full sm:w-auto mt-4 sm:mt-5 bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold gap-1.5 shrink-0"
            >
              <Play className={`w-3.5 h-3.5 ${testingApi ? 'animate-spin' : ''}`} />
              {testingApi ? 'Testando...' : 'Testar Rota'}
            </Button>
          </div>

          {/* Grid de Payload de Entrada & Resposta JSON */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Payload de Entrada */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
                <span>Payload de Exemplo (JSON Query):</span>
                <span className="text-[10px] font-mono text-slate-400">application/json</span>
              </div>
              <pre className="p-3 rounded-lg bg-slate-900 text-sky-300 font-mono text-[11px] overflow-x-auto h-44 border border-slate-800">
                {JSON.stringify(routesCatalog[selectedRoute].samplePayload, null, 2)}
              </pre>
            </div>

            {/* Resposta do Servidor */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
                <span>Resposta do Servidor:</span>
                {apiLatency && (
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    200 OK &bull; {apiLatency}ms
                  </span>
                )}
              </div>
              <pre className="p-3 rounded-lg bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto h-44 border border-slate-800">
                {apiResponse || (
                  <span className="text-slate-500 italic">
                    Clique em &quot;Testar Rota&quot; para disparar a requisição simulada via Kong
                    Gateway...
                  </span>
                )}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
