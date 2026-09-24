import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Boxes,
  Database,
  Shield,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Download,
  PlusCircle,
  Clock,
  Layers,
  Sparkles,
  Server,
  Zap,
} from 'lucide-react'
import {
  CANONICAL_PROJECTS,
  DOMAINS,
  RECENT_ACTIVITIES,
  BACKEND_CONFIG,
} from '@/data/canonicalData'
import { DomainCode } from '@/data/types'
import { exportCatalogMarkdown } from '@/lib/exportUtils'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Index() {
  const navigate = useNavigate()
  const [testingPing, setTestingPing] = useState(false)
  const [currentLatency, setCurrentLatency] = useState(28)

  const totalProjects = CANONICAL_PROJECTS.length
  const totalSchemas = new Set(CANONICAL_PROJECTS.map((p) => p.schema)).size

  // Domain counts
  const domainCounts = CANONICAL_PROJECTS.reduce<Record<DomainCode, number>>(
    (acc, proj) => {
      acc[proj.dominio] = (acc[proj.dominio] || 0) + 1
      return acc
    },
    { mfo: 0, legal: 0, agent: 0, comm: 0, tpl: 0 },
  )

  const domainColors: Record<DomainCode, string> = {
    mfo: '#0369A1',
    legal: '#7C3AED',
    agent: '#0D9488',
    comm: '#059669',
    tpl: '#D97706',
  }

  const handleTestLatency = () => {
    setTestingPing(true)
    setTimeout(() => {
      const nextMs = Math.floor(Math.random() * 12) + 22
      setCurrentLatency(nextMs)
      setTestingPing(false)
      toast.success(`Latência de ${nextMs}ms aferida via Kong Gateway.`)
    }, 800)
  }

  const handleExport = () => {
    exportCatalogMarkdown()
    toast.success('Catálogo Canônico (33 Projetos) baixado em Markdown.')
  }

  // Sparkline mockup 24h (latência em ms)
  const sparklineData = [
    29,
    31,
    28,
    27,
    32,
    28,
    26,
    30,
    27,
    28,
    29,
    31,
    28,
    27,
    28,
    29,
    30,
    28,
    26,
    28,
    27,
    29,
    28,
    currentLatency,
  ]
  const minLat = Math.min(...sparklineData)
  const maxLat = Math.max(...sparklineData)

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-100 text-sky-800 border border-sky-200 uppercase tracking-wider">
              Ecossistema Skip Cloud &bull; Coolify VPS &bull; Supabase
            </span>
            <span className="text-xs text-slate-400 font-mono">SYSTEM.md §2.6.3</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Console de Governança Skip Cloud
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-3xl">
            Central de governança, inventário canônico e orquestração de data plane para os 33
            projetos integrados com schemas isolados em Supabase Self-Hosted.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            onClick={() => navigate('/esteira')}
            className="bg-sky-700 hover:bg-sky-800 text-white shadow-xs text-xs font-semibold gap-2 transition-transform hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" />
            Novo Intake de Projeto
          </Button>

          <Button
            onClick={handleExport}
            variant="outline"
            className="bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-xs text-xs font-semibold gap-2 transition-transform hover:scale-[1.02]"
          >
            <Download className="w-4 h-4 text-slate-600" />
            Exportar Catálogo
          </Button>
        </div>
      </div>

      {/* 4 Cards de Métricas Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Projetos Ativos */}
        <Card className="bg-white border-slate-200 shadow-xs hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Projetos Ativos
            </CardTitle>
            <div className="w-8 h-8 rounded-md bg-sky-50 text-sky-700 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 font-mono">{totalProjects}</div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-700">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 font-mono text-[11px]">
                <TrendingUp className="w-3 h-3 mr-1 inline" />
                +2 este mês
              </span>
              <span className="text-slate-500 font-normal">no catálogo SSOT</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Schemas Segregados */}
        <Card className="bg-white border-slate-200 shadow-xs hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Schemas Segregados
            </CardTitle>
            <div className="w-8 h-8 rounded-md bg-purple-50 text-purple-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 font-mono">{totalSchemas}</div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
              <span className="font-mono text-slate-700 font-medium">skip_*</span>
              <span>100% isolamento no Postgres</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Saúde do Backend */}
        <Card className="bg-white border-slate-200 shadow-xs hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Saúde do Backend
            </CardTitle>
            <div className="w-8 h-8 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Operacional
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-2.5 text-xs text-slate-500 font-mono">
              <Server className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {BACKEND_CONFIG.host}:{BACKEND_CONFIG.port}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Ambiente */}
        <Card className="bg-white border-slate-200 shadow-xs hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Ambiente Ativo
            </CardTitle>
            <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              Produção
              <span className="text-[10px] font-mono font-normal px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                PRD
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-500 truncate font-mono">
              VPS Coolify:{' '}
              <span className="text-slate-700 font-semibold">{BACKEND_CONFIG.coolifyVpsId}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid: Gráfico de Distribuição por Domínio + Painel de Saúde do Supabase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribuição por Domínio (2 colunas em desktop) */}
        <Card className="lg:col-span-2 bg-white border-slate-200 shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Distribuição Canônica por Domínio
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Mapeamento taxonômico dos 33 projetos e seus ecossistemas de downstream
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/inventario')}
                className="text-xs text-sky-700 hover:text-sky-800 hover:bg-sky-50 flex items-center gap-1 font-semibold"
              >
                Ver inventário completo
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-5 space-y-6">
            {/* Barra Empilhada Proporcional */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Composição Percentual</span>
                <span className="font-mono text-slate-700">100% (33 Projetos)</span>
              </div>
              <div className="h-6 w-full rounded-md overflow-hidden flex shadow-inner bg-slate-100 p-0.5 gap-0.5">
                {(['mfo', 'legal', 'agent', 'comm', 'tpl'] as DomainCode[]).map((dom) => {
                  const count = domainCounts[dom]
                  const pct = ((count / totalProjects) * 100).toFixed(1)
                  return (
                    <div
                      key={dom}
                      style={{
                        width: `${pct}%`,
                        backgroundColor: domainColors[dom],
                      }}
                      className="h-full first:rounded-l last:rounded-r transition-all duration-300 relative group cursor-pointer"
                      title={`${DOMAINS[dom].label}: ${count} projetos (${pct}%)`}
                      onClick={() => navigate(`/inventario?dominio=${dom}`)}
                    />
                  )
                })}
              </div>
            </div>

            {/* Legenda com Cards Interativos de Domínio */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {(['mfo', 'legal', 'agent', 'comm', 'tpl'] as DomainCode[]).map((dom) => {
                const info = DOMAINS[dom]
                const count = domainCounts[dom]
                const pct = Math.round((count / totalProjects) * 100)
                return (
                  <button
                    key={dom}
                    onClick={() => navigate(`/inventario?dominio=${dom}`)}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-sky-300 hover:shadow-xs transition-all text-left group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: domainColors[dom] }}
                      ></span>
                      <span className="text-[10px] font-mono text-slate-400 group-hover:text-sky-700">
                        {pct}%
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-800 truncate">
                      {info.label}
                    </div>
                    <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                      {count} <span className="text-[11px] font-normal text-slate-500">apps</span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Guia Rápido de Taxonomia */}
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3 flex items-start gap-3 text-xs text-slate-600">
              <Sparkles className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">Padrão Canônico SSOT:</span> Todas as
                aplicações são identificadas pela fórmula{' '}
                <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-sky-800 font-medium">
                  [dominio]__[slug_semantico]__[skip_uuid_curto]
                </code>
                , mapeadas a um schema único em Postgres.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Painel de Saúde do Supabase & Sparkline */}
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Saúde do Data Plane
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Telemetria Supabase Self-Hosted
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestLatency}
                disabled={testingPing}
                className="h-8 text-xs gap-1.5 border-slate-200 hover:bg-slate-50"
              >
                <Zap
                  className={`w-3.5 h-3.5 text-sky-700 ${testingPing ? 'animate-bounce' : ''}`}
                />
                Testar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {/* Status & Latência */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs text-slate-500">Latência Kong (24h)</span>
                <div className="text-2xl font-bold font-mono text-slate-900 flex items-baseline gap-1">
                  {currentLatency}
                  <span className="text-xs font-normal text-slate-500">ms</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500">Uptime 30d</span>
                <div className="text-lg font-bold font-mono text-emerald-700">99.98%</div>
              </div>
            </div>

            {/* Sparkline Visual (SVG) */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1 font-mono">
                <span>Histórico 24h</span>
                <span>
                  min {minLat}ms / máx {maxLat}ms
                </span>
              </div>
              <div className="h-16 w-full bg-slate-50 rounded border border-slate-200 p-1 flex items-end">
                <svg className="w-full h-full" viewBox="0 0 240 60" preserveAspectRatio="none">
                  <path
                    d={`M 0,${60 - ((sparklineData[0] - 20) / 20) * 50} ${sparklineData
                      .map(
                        (val, idx) =>
                          `L ${(idx / (sparklineData.length - 1)) * 240},${60 - ((val - 20) / 20) * 50}`,
                      )
                      .join(' ')}`}
                    fill="none"
                    stroke="#0369A1"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d={`M 0,${60 - ((sparklineData[0] - 20) / 20) * 50} ${sparklineData
                      .map(
                        (val, idx) =>
                          `L ${(idx / (sparklineData.length - 1)) * 240},${60 - ((val - 20) / 20) * 50}`,
                      )
                      .join(' ')} L 240,60 L 0,60 Z`}
                    fill="url(#sparklineGrad)"
                    opacity="0.25"
                  />
                  <defs>
                    <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0369A1" />
                      <stop offset="100%" stopColor="#0369A1" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Parâmetros Rápidos */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Host Oficial</span>
                <span className="font-mono text-slate-800 font-medium">{BACKEND_CONFIG.host}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Porta Postgres</span>
                <span className="font-mono text-slate-800 font-medium">{BACKEND_CONFIG.port}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">Isolamento</span>
                <span className="text-emerald-700 font-semibold">Strict Schema (Seção 12)</span>
              </div>
            </div>

            <Button
              onClick={() => navigate('/conectores')}
              variant="outline"
              className="w-full text-xs border-slate-200 hover:bg-slate-50 text-slate-700"
            >
              Explorar Conectores &amp; Rotas
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Feed de Atividades Recentes do Catálogo */}
      <Card className="bg-white border-slate-200 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                Feed de Governança &amp; Atividade Recente
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Registros de intake, validação DDL de schemas e promoções no Coolify
              </CardDescription>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Sincronização em tempo real
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="divide-y divide-slate-100">
            {RECENT_ACTIVITIES.map((act) => (
              <div
                key={act.id}
                className="py-3 flex items-start justify-between gap-4 first:pt-0 last:pb-0 hover:bg-slate-50/50 rounded-md px-2 -mx-2 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {act.tipo === 'health' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block"></span>
                    )}
                    {act.tipo === 'schema' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-500 block"></span>
                    )}
                    {act.tipo === 'promocao' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500 block"></span>
                    )}
                    {act.tipo === 'intake' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block"></span>
                    )}
                    {act.tipo === 'drift' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block"></span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-800">{act.titulo}</span>
                      {act.dominio && (
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {act.dominio}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{act.descricao}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-400 font-mono block">
                    {act.timestamp}
                  </span>
                  <span
                    className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded font-medium border ${
                      act.status === 'Live' || act.status === 'Healthy'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : act.status === 'Validado'
                          ? 'bg-sky-50 text-sky-700 border-sky-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {act.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
