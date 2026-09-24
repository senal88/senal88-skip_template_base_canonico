import { useState, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  Search,
  LayoutGrid,
  List,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Copy,
  Download,
  FileCode,
  ShieldCheck,
  Server,
  Layers,
  Sparkles,
  Info,
  X,
} from 'lucide-react'
import { CANONICAL_PROJECTS, DOMAINS, BACKEND_CONFIG } from '@/data/canonicalData'
import { ProjectCanonical, DomainCode, ProjectStatus } from '@/data/types'
import { generateProjectYaml } from '@/lib/exportUtils'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export default function Inventario() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  // Filtros persistidos ou sincronizados
  const initialDomain = searchParams.get('dominio') || 'todos'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDomain, setSelectedDomain] = useState<string>(initialDomain)
  const [selectedStatus, setSelectedStatus] = useState<string>('todos')
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')

  // Modal de Detalhes
  const [activeProject, setActiveProject] = useState<ProjectCanonical | null>(null)

  // Sincronizar selectedDomain com url param
  const handleDomainChange = (domain: string) => {
    setSelectedDomain(domain)
    if (domain === 'todos') {
      searchParams.delete('dominio')
    } else {
      searchParams.set('dominio', domain)
    }
    setSearchParams(searchParams)
  }

  // Filtragem em tempo real
  const filteredProjects = useMemo(() => {
    return CANONICAL_PROJECTS.filter((proj) => {
      // Busca por nome, slug ou id
      const matchesSearch =
        proj.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.schema.toLowerCase().includes(searchQuery.toLowerCase())

      // Filtro domínio
      const matchesDomain = selectedDomain === 'todos' || proj.dominio === selectedDomain

      // Filtro status
      const matchesStatus = selectedStatus === 'todos' || proj.status === selectedStatus

      return matchesSearch && matchesDomain && matchesStatus
    })
  }, [searchQuery, selectedDomain, selectedStatus])

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copiado para a área de transferência!`)
  }

  const handleDownloadYaml = (project: ProjectCanonical) => {
    const yamlContent = generateProjectYaml(project.slug)
    const blob = new Blob([yamlContent], { type: 'text/yaml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${project.id}.yaml`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(`Manifesto ${project.id}.yaml baixado!`)
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
              SSOT Canônico &bull; Seção 12
            </span>
            <span className="text-xs text-slate-400 font-mono">33 Projetos Catalogados</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Inventário &amp; Governança
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-3xl">
            Catálogo completo e padronizado do ecossistema Skip Cloud. Cada aplicação possui seu
            próprio schema isolado (
            <code className="font-mono text-sky-800 font-semibold">skip_*</code>) no Supabase
            Self-Hosted.
          </p>
        </div>

        {/* Action Right */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate('/esteira')}
            className="bg-sky-700 hover:bg-sky-800 text-white shadow-xs text-xs font-semibold gap-2"
          >
            Novo Intake de Projeto
          </Button>
        </div>
      </div>

      {/* Controles de Busca, Filtro e Toggle View */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Busca em tempo real */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome, slug, ID curto (ex: f5b6d759) ou schema..."
              className="pl-9 bg-slate-50/70 border-slate-200 text-xs focus:bg-white focus:border-sky-700 focus:ring-2 focus:ring-sky-700/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filtro por Domínio */}
          <div className="w-full md:w-auto flex items-center gap-2">
            <select
              value={selectedDomain}
              onChange={(e) => handleDomainChange(e.target.value)}
              className="w-full md:w-48 text-xs h-9 px-2.5 bg-slate-50/70 border border-slate-200 rounded-md text-slate-700 font-medium focus:outline-hidden focus:border-sky-700 focus:ring-2 focus:ring-sky-700/20"
            >
              <option value="todos">Todos os Domínios (33)</option>
              {Object.values(DOMAINS).map((d) => (
                <option key={d.code} value={d.code}>
                  {d.label}
                </option>
              ))}
            </select>

            {/* Filtro por Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full md:w-36 text-xs h-9 px-2.5 bg-slate-50/70 border border-slate-200 rounded-md text-slate-700 font-medium focus:outline-hidden focus:border-sky-700 focus:ring-2 focus:ring-sky-700/20"
            >
              <option value="todos">Todos os Status</option>
              <option value="Live">Live (Produção)</option>
              <option value="Validado">Validado</option>
              <option value="Protótipo">Protótipo / WIP</option>
            </select>

            {/* Toggle Tabela / Cards */}
            <div className="flex items-center border border-slate-200 rounded-md overflow-hidden bg-slate-100 p-0.5">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-sky-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Visualização em Tabela Densa"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-white text-sky-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Visualização em Grade de Cards"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Status bar dos resultados */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <div>
            Mostrando <span className="font-bold text-slate-800">{filteredProjects.length}</span> de{' '}
            <span className="font-mono text-slate-700">33</span> projetos canônicos
            {selectedDomain !== 'todos' && (
              <span className="ml-1 text-sky-700 font-medium">
                ({DOMAINS[selectedDomain]?.label})
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Conforme Seção 12
            </span>
          </div>
        </div>
      </div>

      {/* VIEW: TABELA DENSA */}
      {viewMode === 'table' && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">ID Curto</th>
                  <th className="py-2.5 px-3">Nome Original</th>
                  <th className="py-2.5 px-3">Slug Padronizado</th>
                  <th className="py-2.5 px-3">Domínio</th>
                  <th className="py-2.5 px-3">Schema Supabase</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Fluxo (Up &rarr; Down)</th>
                  <th className="py-2.5 px-3 text-center">Conformidade</th>
                  <th className="py-2.5 px-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map((p) => {
                  const domainInfo = DOMAINS[p.dominio]
                  return (
                    <tr
                      key={p.id}
                      onClick={() => setActiveProject(p)}
                      className="hover:bg-sky-50/50 cursor-pointer transition-colors group"
                    >
                      {/* ID Curto */}
                      <td className="py-2 px-3 font-mono font-bold text-slate-800">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px]">
                          {p.id}
                        </span>
                      </td>

                      {/* Nome Original */}
                      <td className="py-2 px-3 font-medium text-slate-900 group-hover:text-sky-800">
                        {p.nome}
                      </td>

                      {/* Slug Padronizado Truncado com Tooltip */}
                      <td className="py-2 px-3 font-mono text-[11px] text-slate-500 max-w-[200px]">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="truncate block font-mono text-slate-600 hover:text-sky-700">
                              {p.slug}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="bg-slate-900 text-white text-xs font-mono max-w-sm"
                          >
                            {p.slug}
                          </TooltipContent>
                        </Tooltip>
                      </td>

                      {/* Domínio */}
                      <td className="py-2 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${domainInfo?.colorBadge}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${domainInfo?.dotColor} mr-1`}
                          ></span>
                          {domainInfo?.code.toUpperCase()}
                        </span>
                      </td>

                      {/* Schema Supabase */}
                      <td className="py-2 px-3 font-mono text-[11px] text-sky-900 font-medium">
                        <span className="bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100">
                          {p.schema}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-2 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${
                            p.status === 'Live'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : p.status === 'Validado'
                                ? 'bg-sky-50 text-sky-700 border-sky-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      {/* Fluxo */}
                      <td className="py-2 px-3 text-slate-600">
                        <div className="flex items-center gap-1 text-[11px]">
                          <span className="truncate max-w-[100px] text-slate-500">
                            {p.upstream}
                          </span>
                          <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[100px] font-mono text-slate-700 font-medium">
                            {p.downstream}
                          </span>
                        </div>
                      </td>

                      {/* Conformidade */}
                      <td className="py-2 px-3 text-center">
                        {p.conforme ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="bg-slate-900 text-white text-xs">
                              Conforme Seção 12: Skip Cloud + Supabase isolado ({p.schema})
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                <AlertTriangle className="w-3.5 h-3.5" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="bg-slate-900 text-white text-xs">
                              Alerta: Schema duplicado ou em revisão de isolamento
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </td>

                      {/* Ação */}
                      <td className="py-2 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveProject(p)
                          }}
                          className="px-2 py-1 rounded text-[11px] font-medium text-sky-700 hover:bg-sky-100/70 border border-sky-200 transition-colors"
                        >
                          Detalhes
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: GRID DE CARDS */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((p) => {
            const domainInfo = DOMAINS[p.dominio]
            return (
              <Card
                key={p.id}
                onClick={() => setActiveProject(p)}
                className="bg-white border-slate-200 hover:border-sky-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="p-4 space-y-3">
                  {/* Card Header Top */}
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${domainInfo?.colorBadge}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${domainInfo?.dotColor} mr-1`}
                      ></span>
                      {domainInfo?.label}
                    </span>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        p.status === 'Live'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : p.status === 'Validado'
                            ? 'bg-sky-50 text-sky-700 border-sky-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  {/* Nome e ID */}
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-sky-800 transition-colors line-clamp-1">
                      {p.nome}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-1 rounded border border-slate-200">
                        {p.id}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono truncate">
                        {p.slug}
                      </span>
                    </div>
                  </div>

                  {/* Schema Supabase */}
                  <div className="p-2 rounded bg-slate-50 border border-slate-100 font-mono text-[11px] flex items-center justify-between">
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                      Schema
                    </span>
                    <span className="text-sky-900 font-medium">{p.schema}</span>
                  </div>

                  {/* Fluxo */}
                  <div className="text-xs text-slate-600 flex items-center justify-between pt-1 border-t border-slate-100">
                    <span className="text-slate-400 text-[11px]">Fluxo:</span>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span className="text-slate-600">{p.upstream}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span className="font-mono text-slate-800 font-medium">{p.downstream}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-4 py-2.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    {p.conforme ? (
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Seção 12 OK
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-700 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5" /> Em validação
                      </span>
                    )}
                  </div>
                  <span className="text-sky-700 font-semibold group-hover:underline text-xs flex items-center gap-1">
                    Abrir Detalhes
                  </span>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* MODAL DE DETALHES DO PROJETO */}
      <Dialog open={!!activeProject} onOpenChange={(open) => !open && setActiveProject(null)}>
        <DialogContent className="max-w-2xl bg-white border border-slate-200 shadow-xl p-6 sm:p-7">
          {activeProject && (
            <div className="space-y-5">
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                      DOMAINS[activeProject.dominio]?.colorBadge
                    }`}
                  >
                    {DOMAINS[activeProject.dominio]?.label}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                      activeProject.status === 'Live'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : activeProject.status === 'Validado'
                          ? 'bg-sky-50 text-sky-700 border-sky-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {activeProject.status}
                  </span>
                  <span className="font-mono text-xs text-slate-400">ID: {activeProject.id}</span>
                </div>

                <DialogTitle className="text-xl font-bold text-slate-900">
                  {activeProject.nome}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 font-mono break-all pt-1">
                  {activeProject.slug}
                </DialogDescription>
              </DialogHeader>

              {/* Informações Funcionais */}
              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <p className="font-normal leading-relaxed">{activeProject.descricao}</p>
              </div>

              {/* Metadados Técnicos em Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Schema Supabase
                  </span>
                  <div className="flex items-center justify-between font-mono text-slate-900 font-semibold">
                    <span className="truncate">{activeProject.schema}</span>
                    <button
                      onClick={() => copyToClipboard(activeProject.schema, 'Schema')}
                      className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Rota Produtiva
                  </span>
                  <div className="flex items-center justify-between font-mono text-slate-900 font-semibold truncate">
                    <span className="truncate">https://{activeProject.id}.mfotrust.com</span>
                    <button
                      onClick={() =>
                        copyToClipboard(`https://${activeProject.id}.mfotrust.com`, 'URL Produtiva')
                      }
                      className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Upstream &rarr; Downstream
                  </span>
                  <div className="font-mono text-slate-900 font-medium truncate">
                    {activeProject.upstream} &rarr; {activeProject.downstream}
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Tabelas &bull; Registros
                  </span>
                  <div className="font-mono text-slate-900 font-semibold">
                    {activeProject.tabelasEstimadas} tabelas &bull;{' '}
                    {activeProject.registrosEstimados.toLocaleString('pt-BR')} linhas
                  </div>
                </div>
              </div>

              {/* Checklist de Conformidade Arquitetural (SYSTEM.md §12) */}
              <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/60 space-y-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Checklist de Conformidade (Seção 12)
                </span>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Frontend concebido no Skip Cloud e exportado para Coolify</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Backend oficial em Supabase Self-Hosted (porta 54322)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>
                      Isolamento estrito de schema (
                      <code className="font-mono text-sky-800">{activeProject.schema}</code>)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>
                      Buckets padronizados:{' '}
                      <code className="font-mono text-slate-700">
                        {activeProject.buckets.public}
                      </code>{' '}
                      e{' '}
                      <code className="font-mono text-slate-700">
                        {activeProject.buckets.private}
                      </code>
                    </span>
                  </div>
                </div>
              </div>

              {/* Ações do Modal */}
              <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    handleDownloadYaml(activeProject)
                  }}
                  className="text-xs border-slate-200 hover:bg-slate-100 gap-1.5"
                >
                  <FileCode className="w-3.5 h-3.5 text-slate-600" />
                  Exportar Manifesto YAML
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    navigate(`/conectores?schema=${activeProject.schema}`)
                    setActiveProject(null)
                  }}
                  className="text-xs border-slate-200 hover:bg-slate-100 gap-1.5"
                >
                  <Server className="w-3.5 h-3.5 text-sky-700" />
                  Ver no Data Plane
                </Button>

                <Button
                  onClick={() => {
                    navigate(`/esteira?tab=exports&projeto=${activeProject.slug}`)
                    setActiveProject(null)
                  }}
                  className="bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Abrir no Pipeline
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
