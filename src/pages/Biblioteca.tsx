import { useState } from 'react'
import {
  Boxes,
  Activity,
  Layers,
  FileText,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  Eye,
  Sliders,
  Sparkles,
  Palette,
  Shield,
  Send,
  FileCheck,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
import { toast } from 'sonner'

export default function Biblioteca() {
  const [activeCategory, setActiveCategory] = useState<
    'metricas' | 'formularios' | 'tabelas' | 'modais' | 'badges' | 'documental' | 'tokens'
  >('metricas')

  // Estado demo do modal de confirmação
  const [demoModalOpen, setDemoModalOpen] = useState(false)
  const [modalConfirmed, setModalConfirmed] = useState(false)

  // Estado demo de formulário
  const [demoInput, setDemoInput] = useState('skip_projeto_exemplo')
  const [demoSelect, setDemoSelect] = useState('mfo')
  const [demoTextarea, setDemoTextarea] = useState('Dossiê consolidado de ativos fiduciários')
  const [hasError, setHasError] = useState(false)

  // Estado demo de seleção na tabela
  const [selectedAuditRows, setSelectedAuditRows] = useState<string[]>(['row-1'])

  const toggleAuditRow = (id: string) => {
    if (selectedAuditRows.includes(id)) {
      setSelectedAuditRows(selectedAuditRows.filter((r) => r !== id))
    } else {
      setSelectedAuditRows([...selectedAuditRows, id])
    }
  }

  const handleConfirmCriticalAction = () => {
    setModalConfirmed(true)
    setDemoModalOpen(false)
    toast.success('Ação crítica confirmada com sucesso!')
  }

  return (
    <div className="space-y-6 pb-16 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-50 text-sky-800 border border-sky-200 uppercase tracking-wider">
              Design System &bull; Apex Light &amp; Documental
            </span>
            <span className="text-xs text-slate-400 font-mono">03_PADRAO_VISUAL_UIUX.md</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Biblioteca de Componentes &amp; Tokens
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-3xl">
            Catálogo interativo de componentes reutilizáveis, contratos de interface e tokens de
            design para consoles corporativos, dashboards analíticos e dossiês documentais.
          </p>
        </div>
      </div>

      {/* Grid de Conteúdo: Navegação Lateral por Categoria + Showcase Interativo */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Menu Lateral de Categorias */}
        <div className="space-y-1 bg-white border border-slate-200 rounded-lg p-2 shadow-xs h-fit">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Componentes de UI
          </div>

          {[
            { id: 'metricas', label: 'Cards de Métricas', icon: Activity },
            { id: 'formularios', label: 'Formulários & Inputs', icon: Sliders },
            { id: 'tabelas', label: 'Tabelas & Seleção', icon: Layers },
            { id: 'modais', label: 'Modais & Confirmação', icon: Shield },
            { id: 'badges', label: 'Badges Semânticos', icon: Sparkles },
            { id: 'documental', label: 'Tema Documental (Dossiês)', icon: FileText },
            { id: 'tokens', label: 'Design Tokens & Paleta', icon: Palette },
          ].map((cat) => {
            const Icon = cat.icon
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-sky-700 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`}
                />
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>

        {/* Painel Central com os Componentes */}
        <div className="lg:col-span-3 space-y-6">
          {/* ==================================================================== */}
          {/* CATEGORIA 1: CARDS DE MÉTRICAS */}
          {/* ==================================================================== */}
          {activeCategory === 'metricas' && (
            <div className="space-y-6">
              <Card className="bg-white border-slate-200 shadow-xs">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-sm font-bold text-slate-900">
                    Cards de Métricas (3 Variantes com Hover Scale)
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Passe o mouse sobre os cards para visualizar o efeito de elevação e transição de
                    escala.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Variante 1: Primário MFO */}
                    <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs hover:shadow-md hover:scale-[1.02] transition-all duration-200">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="font-semibold uppercase text-[10px] tracking-wider">
                          Patrimônio Gerido
                        </span>
                        <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                      </div>
                      <div className="text-2xl font-bold font-mono text-slate-900">R$ 2.4B</div>
                      <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-700 font-medium">
                        <TrendingUp className="w-3 h-3" />
                        <span>+14.2% a.a.</span>
                        <span className="text-slate-400 font-normal">vs benchmark</span>
                      </div>
                    </div>

                    {/* Variante 2: Sucesso / Schemas */}
                    <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs hover:shadow-md hover:scale-[1.02] transition-all duration-200">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="font-semibold uppercase text-[10px] tracking-wider">
                          Schemas Ativos
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      </div>
                      <div className="text-2xl font-bold font-mono text-slate-900">33 / 33</div>
                      <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-700 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>100% isolamento RLS</span>
                      </div>
                    </div>

                    {/* Variante 3: Alerta / Auditoria */}
                    <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs hover:shadow-md hover:scale-[1.02] transition-all duration-200">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="font-semibold uppercase text-[10px] tracking-wider">
                          Jobs em Espera
                        </span>
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      </div>
                      <div className="text-2xl font-bold font-mono text-slate-900">2 jobs</div>
                      <div className="flex items-center gap-1.5 mt-2 text-[11px] text-amber-700 font-medium">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Aguardando DDL make validate</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ==================================================================== */}
          {/* CATEGORIA 2: FORMULÁRIOS & INPUTS */}
          {/* ==================================================================== */}
          {activeCategory === 'formularios' && (
            <Card className="bg-white border-slate-200 shadow-xs">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-900">
                  Formulários, Inputs &amp; Estados de Foco / Erro
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Campos com foco acentuado em{' '}
                  <code className="font-mono text-sky-800">
                    focus:border-sky-700 focus:ring-2 focus:ring-sky-700/20
                  </code>
                  .
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setHasError(!hasError)}
                    className="text-xs h-7 border-slate-200"
                  >
                    {hasError ? 'Remover Estado de Erro' : 'Simular Estado de Erro'}
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Input de Texto */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Identificador do Schema (Monospace)
                    </label>
                    <Input
                      value={demoInput}
                      onChange={(e) => setDemoInput(e.target.value)}
                      className={`font-mono text-xs ${
                        hasError
                          ? 'border-rose-300 focus:border-rose-600 focus:ring-rose-200 bg-rose-50/30'
                          : 'bg-slate-50 border-slate-200 focus:bg-white focus:border-sky-700 focus:ring-2 focus:ring-sky-700/20'
                      }`}
                    />
                    {hasError && (
                      <span className="text-[11px] text-rose-600 mt-1 block">
                        Schema inválido: deve começar com prefixo &quot;skip_&quot;.
                      </span>
                    )}
                  </div>

                  {/* Dropdown Select */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Domínio Canônico
                    </label>
                    <select
                      value={demoSelect}
                      onChange={(e) => setDemoSelect(e.target.value)}
                      className="w-full text-xs h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-md font-medium text-slate-800 focus:outline-hidden focus:border-sky-700 focus:ring-2 focus:ring-sky-700/20"
                    >
                      <option value="mfo">mfo__* (Multi-Family Office &amp; Finanças)</option>
                      <option value="legal">legal__* (Legal, Tributário &amp; Sucessório)</option>
                      <option value="agent">agent__* (MoE &amp; Orquestração)</option>
                      <option value="comm">comm__* (Omnichannel &amp; WhatsApp)</option>
                      <option value="tpl">tpl__* (Templates Base &amp; Clones)</option>
                    </select>
                  </div>

                  {/* Textarea */}
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Descrição da Arquitetura &amp; Notas de Promoção
                    </label>
                    <textarea
                      value={demoTextarea}
                      onChange={(e) => setDemoTextarea(e.target.value)}
                      rows={3}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-sky-700 focus:ring-2 focus:ring-sky-700/20"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ==================================================================== */}
          {/* CATEGORIA 3: TABELAS & SELEÇÃO */}
          {/* ==================================================================== */}
          {activeCategory === 'tabelas' && (
            <Card className="bg-white border-slate-200 shadow-xs">
              <CardHeader className="pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold text-slate-900">
                      Tabela de Auditoria com Checkbox e Linhas Selecionáveis
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      Exemplo de tabela densa interativa com estados de hover e seleção persistente
                    </CardDescription>
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    {selectedAuditRows.length} selecionados
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3 w-8"></th>
                        <th className="py-2.5 px-3">Evento DDL</th>
                        <th className="py-2.5 px-3">Schema</th>
                        <th className="py-2.5 px-3">Autor</th>
                        <th className="py-2.5 px-3 text-right">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        {
                          id: 'row-1',
                          evento: 'CREATE POLICY rls_mfo_admin',
                          schema: 'skip_dashboard_financeir',
                          autor: 'admin@senamfo.com.br',
                          time: '14:28:10',
                        },
                        {
                          id: 'row-2',
                          evento: 'GRANT ALL PRIVILEGES ON ALL TABLES',
                          schema: 'skip_app_financeiro_prd',
                          autor: 'coolify_vps_agent',
                          time: '13:12:44',
                        },
                        {
                          id: 'row-3',
                          evento: 'ALTER SCHEMA skip_irpf_2026_2025 OWNER',
                          schema: 'skip_irpf_2026_2025',
                          autor: 'admin@senamfo.com.br',
                          time: '11:05:02',
                        },
                      ].map((item) => {
                        const isSelected = selectedAuditRows.includes(item.id)
                        return (
                          <tr
                            key={item.id}
                            onClick={() => toggleAuditRow(item.id)}
                            className={`cursor-pointer transition-colors ${
                              isSelected ? 'bg-sky-50/80 font-medium' : 'hover:bg-slate-50/70'
                            }`}
                          >
                            <td className="py-2 px-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleAuditRow(item.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="rounded text-sky-700 focus:ring-sky-700"
                              />
                            </td>
                            <td className="py-2 px-3 font-mono text-slate-800">{item.evento}</td>
                            <td className="py-2 px-3 font-mono text-sky-900">{item.schema}</td>
                            <td className="py-2 px-3 text-slate-600">{item.autor}</td>
                            <td className="py-2 px-3 text-right font-mono text-slate-400">
                              {item.time}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ==================================================================== */}
          {/* CATEGORIA 4: MODAIS & CONFIRMAÇÃO */}
          {/* ==================================================================== */}
          {activeCategory === 'modais' && (
            <Card className="bg-white border-slate-200 shadow-xs">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-900">
                  Modais de Confirmação &amp; Ação Crítica
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Diálogo modal com fade e escala (0.95 &rarr; 1.0) e backdrop com desfoque suave
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => {
                      setDemoModalOpen(true)
                      setModalConfirmed(false)
                    }}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Abrir Modal de Ação Crítica (Demo)
                  </Button>

                  {modalConfirmed && (
                    <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Última ação confirmada com sucesso!
                    </span>
                  )}
                </div>

                <Dialog open={demoModalOpen} onOpenChange={setDemoModalOpen}>
                  <DialogContent className="max-w-md bg-white border border-slate-200 shadow-xl p-6">
                    <DialogHeader>
                      <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <DialogTitle className="text-base font-bold text-slate-900">
                        Confirmar Reindexação DDL do Schema?
                      </DialogTitle>
                      <DialogDescription className="text-xs text-slate-500 pt-1">
                        Esta operação executará uma varredura de tabelas e redefinição de políticas
                        RLS no schema{' '}
                        <code className="font-mono text-slate-800">skip_dashboard_financeir</code>.
                      </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="flex gap-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setDemoModalOpen(false)}
                        className="text-xs border-slate-200 hover:bg-slate-100"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleConfirmCriticalAction}
                        className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
                      >
                        Confirmar Operação
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          )}

          {/* ==================================================================== */}
          {/* CATEGORIA 5: BADGES SEMÂNTICOS */}
          {/* ==================================================================== */}
          {activeCategory === 'badges' && (
            <Card className="bg-white border-slate-200 shadow-xs">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-900">
                  Todos os Variants de Badges Semânticos (SSOT)
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Classes exatas extraídas de 03_PADRAO_VISUAL_UIUX_E_ENTRADAS_SAIDAS.md
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-medium">Live / Validado</span>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-xs font-semibold">
                      Live
                    </span>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-medium">Protótipo / WIP</span>
                    <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-xs font-semibold">
                      Protótipo
                    </span>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-medium">Drift / Erro</span>
                    <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded text-xs font-semibold">
                      Drift
                    </span>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-medium">Saúde Operacional</span>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Healthy
                    </span>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-medium">Aviso de Governança</span>
                    <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Warning
                    </span>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-medium">Domínio MFO</span>
                    <span className="bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded text-xs font-semibold">
                      MFO
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ==================================================================== */}
          {/* CATEGORIA 6: TEMA DOCUMENTAL (DOSSIÊS & LAUDOS) */}
          {/* ==================================================================== */}
          {activeCategory === 'documental' && (
            <Card className="bg-white border-slate-200 shadow-xs">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-900">
                  Visualizador de Documentos no Tema &quot;Documental&quot;
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Específico para laudos periciais NBR 14653, relatórios fiscais Lei 15.270 e
                  dossiês de clientes
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {/* Mockup do Visualizador Documental */}
                <div className="border border-slate-300 rounded-lg shadow-sm bg-white overflow-hidden max-w-2xl mx-auto">
                  {/* Barra de Cabeçalho do Dossiê */}
                  <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-sky-700" />
                      <span className="font-bold text-slate-800">
                        Laudo de Avaliação Fiduciária &bull; MFO Trust
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-semibold text-[10px] border border-sky-200">
                        Dossiê Oficial
                      </span>
                      <span className="font-mono text-slate-400 text-[11px]">NBR-14653/2025</span>
                    </div>
                  </div>

                  {/* Conteúdo com Placeholder Lines Documentais */}
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          Estrutura Patrimonial &amp; Holding Familiar
                        </h4>
                        <span className="text-xs text-slate-400 font-mono">
                          UUID: 971b493b-e03b-4860-9844-avaliacao
                        </span>
                      </div>
                      <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Autenticado ICP-Brasil
                      </span>
                    </div>

                    {/* Placeholder text lines */}
                    <div className="space-y-2 py-2">
                      <div className="h-3 bg-slate-200 rounded w-full"></div>
                      <div className="h-3 bg-slate-100 rounded w-11/12"></div>
                      <div className="h-3 bg-slate-100 rounded w-4/5"></div>
                      <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                    </div>

                    {/* Box de Resumo Financeiro */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-md grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Valor Mercadológico
                        </span>
                        <span className="font-mono font-bold text-slate-900">R$ 18.450.000</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Alíquota ITCMD
                        </span>
                        <span className="font-mono font-bold text-slate-900">
                          8.0% (Progressivo)
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Status Fiscal
                        </span>
                        <span className="font-bold text-emerald-700">Homologado</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ==================================================================== */}
          {/* CATEGORIA 7: DESIGN TOKENS & PALETA */}
          {/* ==================================================================== */}
          {activeCategory === 'tokens' && (
            <Card className="bg-white border-slate-200 shadow-xs">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-900">
                  Design Tokens Canônicos (Apex Light)
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Swatches renderizados, escala tipográfica Inter/JetBrains Mono e espaçamentos
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-6">
                {/* Paleta de Cores */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Paleta de Cores do Sistema
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-2.5 rounded border border-slate-200 bg-white">
                      <div className="h-10 rounded bg-[#F8FAFC] border border-slate-200 mb-2"></div>
                      <span className="text-xs font-bold text-slate-900 block">bg-slate-50</span>
                      <span className="text-[10px] font-mono text-slate-400">#F8FAFC (Fundo)</span>
                    </div>

                    <div className="p-2.5 rounded border border-slate-200 bg-white">
                      <div className="h-10 rounded bg-[#0369A1] mb-2 shadow-xs"></div>
                      <span className="text-xs font-bold text-slate-900 block">bg-sky-700</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        #0369A1 (Primário)
                      </span>
                    </div>

                    <div className="p-2.5 rounded border border-slate-200 bg-white">
                      <div className="h-10 rounded bg-[#0F172A] mb-2 shadow-xs"></div>
                      <span className="text-xs font-bold text-slate-900 block">text-slate-900</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        #0F172A (Texto Primário)
                      </span>
                    </div>

                    <div className="p-2.5 rounded border border-slate-200 bg-white">
                      <div className="h-10 rounded bg-[#64748B] mb-2 shadow-xs"></div>
                      <span className="text-xs font-bold text-slate-900 block">text-slate-500</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        #64748B (Secundário)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cores de Domínio */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Cores dos 5 Domínios de Produto
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
                    <div className="p-2 rounded bg-sky-50 border border-sky-200 text-sky-800">
                      <strong>mfo</strong> #0369A1
                    </div>
                    <div className="p-2 rounded bg-purple-50 border border-purple-200 text-purple-800">
                      <strong>legal</strong> #7C3AED
                    </div>
                    <div className="p-2 rounded bg-teal-50 border border-teal-200 text-teal-800">
                      <strong>agent</strong> #0D9488
                    </div>
                    <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-800">
                      <strong>comm</strong> #059669
                    </div>
                    <div className="p-2 rounded bg-amber-50 border border-amber-200 text-amber-800">
                      <strong>tpl</strong> #D97706
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
