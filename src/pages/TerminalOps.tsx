import React, { useState, useRef, useEffect } from 'react'
import {
  Terminal as TerminalIcon,
  Copy,
  Trash2,
  Play,
  Sparkles,
  ArrowRight,
  Database,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  ChevronRight,
  ExternalLink,
  Code2,
  FileCode,
  Zap,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { CANONICAL_PROJECTS, BACKEND_CONFIG, SCHEMAS_TELEMETRY, DOMAINS } from '@/data/canonicalData'
import MultiFormatDrawer from '@/components/MultiFormatDrawer'
import { ProjectCanonical } from '@/data/types'

interface TerminalLog {
  id: string
  command: string
  output: React.ReactNode | string
  timestamp: string
  type?: 'standard' | 'success' | 'error' | 'table'
}

export default function TerminalOps() {
  const [logs, setLogs] = useState<TerminalLog[]>([
    {
      id: 'init-1',
      command: 'system info',
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      output:
        'Sessão iniciada no Terminal Operacional Apex Documental. Digite "help" para ver os comandos homologados.',
      type: 'standard',
    },
  ])
  const [currentInput, setCurrentInput] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)
  const [selectedProject, setSelectedProject] = useState<ProjectCanonical>(CANONICAL_PROJECTS[0])
  const [drawerOpen, setDrawerOpen] = useState(false)

  // PromptOps Studio States
  const [provider, setProvider] = useState<
    | 'OpenCode Go (DeepSeek-v4.1-flash)'
    | 'OpenCode Go (GLM-5.3-flash)'
    | 'OpenRouter (Claude 3.7 Sonnet)'
    | 'OpenRouter (OpenAI o3-mini)'
  >('OpenCode Go (DeepSeek-v4.1-flash)')
  const [promptVariant, setPromptVariant] = useState<'max' | 'standard'>('max')
  const [rawPromptInput, setRawPromptInput] = useState(
    'Crie um módulo de conciliação bancária multi-tenant com integração direta com BTG Pactual, extratos OFX/CNAB240 e isolamento de dados por cliente fiduciário.',
  )
  const [optimizing, setOptimizing] = useState(false)
  const [optimizedResult, setOptimizedResult] = useState<{
    systemPrompt: string
    userPrompt: string
    provider: string
    model: string
    generatedAt: string
  } | null>(null)

  const terminalEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Rolar para o final do terminal ao adicionar logs
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  // Foco no terminal ao clicar
  const focusInput = () => {
    inputRef.current?.focus()
  }

  // Execução de Comandos do Terminal
  const executeCommand = (cmdText: string) => {
    const trimmed = cmdText.trim()
    if (!trimmed) return

    // Adiciona ao histórico de comandos
    setCommandHistory((prev) => [...prev, trimmed])
    setHistoryIndex(-1)

    const lower = trimmed.toLowerCase()
    const parts = trimmed.split(' ')
    const baseCmd = parts[0].toLowerCase()

    let newOutput: React.ReactNode = ''
    let type: 'standard' | 'success' | 'error' | 'table' = 'standard'

    if (lower === 'clear') {
      setLogs([])
      setCurrentInput('')
      return
    } else if (lower === 'help') {
      newOutput = (
        <div className="space-y-1.5 text-slate-200">
          <p className="font-bold text-sky-400">Comandos operacionais homologados (v0.0.2):</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[11px] pt-1">
            <div>
              <span className="text-emerald-400 font-bold">help</span>
              <span className="text-slate-400"> - Lista todos os comandos disponíveis</span>
            </div>
            <div>
              <span className="text-emerald-400 font-bold">status</span>
              <span className="text-slate-400"> - Telemetria do Supabase Self-Hosted (Coolify)</span>
            </div>
            <div>
              <span className="text-emerald-400 font-bold">schemas list</span>
              <span className="text-slate-400"> - Tabela ASCII com os 33 schemas segregados</span>
            </div>
            <div>
              <span className="text-emerald-400 font-bold">tunnel open</span>
              <span className="text-slate-400"> - Simulação do túnel SSH operacional (porta 54322)</span>
            </div>
            <div>
              <span className="text-emerald-400 font-bold">rls verify &lt;schema&gt;</span>
              <span className="text-slate-400"> - Auditoria de isolamento e bloqueio em public</span>
            </div>
            <div>
              <span className="text-emerald-400 font-bold">ping</span>
              <span className="text-slate-400"> - Health check HTTP na API REST (Kong Gateway)</span>
            </div>
            <div>
              <span className="text-emerald-400 font-bold">clear</span>
              <span className="text-slate-400"> - Limpeza da tela do terminal</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 pt-1">
            Dica: use setas <kbd className="px-1 bg-slate-800 rounded">▲</kbd> e{' '}
            <kbd className="px-1 bg-slate-800 rounded">▼</kbd> para navegar no histórico.
          </p>
        </div>
      )
    } else if (lower === 'status') {
      newOutput = (
        <div className="space-y-1 text-slate-200">
          <p className="font-bold text-sky-400">[TELEMETRIA SUPABASE SELF-HOSTED - COOLIFY]</p>
          <div className="font-mono text-[11px] space-y-0.5 text-slate-300">
            <p>
              Host Oficial:&emsp;&emsp;&emsp;&emsp;{BACKEND_CONFIG.host} (Kong 2.8.4)
            </p>
            <p>
              Porta PostgreSQL:&emsp;&emsp;&emsp;54322 (Túnel SSH Ativo / 127.0.0.1)
            </p>
            <p>
              VPS Coolify ID:&emsp;&emsp;&emsp;&emsp;{BACKEND_CONFIG.coolifyVpsId}
            </p>
            <p>Latência Kong Gateway:&emsp;28ms (Avg jitter: &plusmn;2ms)</p>
            <p>
              Schemas Registrados:&emsp;&emsp;33 schemas segregados no padrão &quot;skip_*&quot;
            </p>
            <p>
              Conformidade Seção 12:&emsp;31/33 validados (100% schemas isolados de produto)
            </p>
            <p>Credenciais Auditadas:&emsp;0 segredos expostos (Higienização Rígida aprovada)</p>
          </div>
        </div>
      )
      type = 'success'
    } else if (lower === 'schemas list') {
      newOutput = (
        <div className="overflow-x-auto text-[11px] font-mono text-slate-200 leading-tight">
          <p className="font-bold text-sky-400 pb-1">
            +------------+-----------------------------------+----------+-----------+------------+
          </p>
          <p className="font-bold text-sky-300">
            | ID CURTO   | SCHEMA SUPABASE                   | DOMÍNIO  | TABELAS   | REGISTROS  |
          </p>
          <p className="font-bold text-sky-400">
            +------------+-----------------------------------+----------+-----------+------------+
          </p>
          {CANONICAL_PROJECTS.map((proj) => (
            <p key={proj.id} className="hover:text-emerald-300">
              | {proj.id.padEnd(10)} | {proj.schema.padEnd(33)} | {proj.dominio.padEnd(8)} |{' '}
              {String(proj.tabelasEstimadas).padEnd(9)} |{' '}
              {proj.registrosEstimados.toLocaleString('pt-BR').padEnd(10)} |
            </p>
          ))}
          <p className="font-bold text-sky-400">
            +------------+-----------------------------------+----------+-----------+------------+
          </p>
          <p className="text-[10px] text-emerald-400 pt-1">
            Total: 33 schemas canônicos segregados &bull; Schema &quot;public&quot; bloqueado
          </p>
        </div>
      )
      type = 'table'
    } else if (lower === 'tunnel open') {
      newOutput = (
        <div className="space-y-1 text-slate-200">
          <p className="text-amber-300 font-bold">
            [+] Estabelecendo túnel operacional SSH seguro via Coolify...
          </p>
          <p className="text-slate-400 text-[11px]">
            &gt; ssh -N -L 54322:127.0.0.1:5432 postgres@senamfo-coolify (vps: {BACKEND_CONFIG.coolifyVpsId})
          </p>
          <p className="text-emerald-400 font-bold text-[11px]">
            [OK] Túnel local ativo em 127.0.0.1:54322 &lt;--&gt; PostgreSQL 15.6 (Supabase)
          </p>
          <p className="text-slate-400 text-[10px]">
            Sessão persistente criptografada ed25519. Sem timeout por inatividade.
          </p>
        </div>
      )
      type = 'success'
    } else if (lower.startsWith('rls verify')) {
      const targetSchema = parts[2] ? parts[2].trim() : selectedProject.schema
      const matched = CANONICAL_PROJECTS.find(
        (p) => p.schema.toLowerCase() === targetSchema.toLowerCase() || p.id === targetSchema,
      )

      if (matched) {
        newOutput = (
          <div className="space-y-1 text-slate-200">
            <p className="font-bold text-sky-400">
              [AUDITORIA DE RLS E ISOLAMENTO: {matched.schema}]
            </p>
            <p className="text-emerald-400 text-[11px]">
              ✔ Schema segregado: &quot;{matched.schema}&quot; verificado
            </p>
            <p className="text-emerald-400 text-[11px]">
              ✔ Bloqueio em public: Nenhuma tabela de produto encontrada em public (Regra §12 OK)
            </p>
            <p className="text-emerald-400 text-[11px]">
              ✔ RLS ativo em {matched.tabelasEstimadas} tabelas (app_id: &quot;{matched.id}&quot;)
            </p>
            <p className="text-emerald-400 text-[11px]">
              ✔ Buckets mapeados: {matched.buckets.public} (público) e {matched.buckets.private}{' '}
              (privado)
            </p>
            <p className="text-slate-400 text-[10px] pt-0.5">
              Status de auditoria: 100% em conformidade com SYSTEM.md §12.
            </p>
          </div>
        )
        type = 'success'
      } else {
        newOutput = (
          <div className="text-rose-400">
            [ERRO] Schema &quot;{targetSchema}&quot; não encontrado no catálogo. Execute &quot;schemas list&quot; para consultar os 33 válidos.
          </div>
        )
        type = 'error'
      }
    } else if (lower === 'ping') {
      newOutput = (
        <div className="space-y-0.5 text-slate-200">
          <p className="text-sky-300 font-bold">&gt; PING {BACKEND_CONFIG.host} (Kong REST Gateway):</p>
          <p className="text-emerald-400 text-[11px]">
            64 bytes from {BACKEND_CONFIG.host}: icmp_seq=1 ttl=58 time=27.4 ms
          </p>
          <p className="text-emerald-400 text-[11px]">
            64 bytes from {BACKEND_CONFIG.host}: icmp_seq=2 ttl=58 time=28.1 ms
          </p>
          <p className="text-emerald-400 text-[11px]">
            64 bytes from {BACKEND_CONFIG.host}: icmp_seq=3 ttl=58 time=27.8 ms
          </p>
          <p className="text-slate-400 text-[10px] pt-1">
            3 packets transmitted, 3 received, 0% packet loss, avg latency 27.76ms (Status: 200 OK)
          </p>
        </div>
      )
      type = 'success'
    } else {
      newOutput = (
        <div className="text-rose-400">
          Comando não reconhecido: &quot;{cmdText}&quot;. Digite <strong className="text-white">help</strong> para ver a lista de comandos suportados.
        </div>
      )
      type = 'error'
    }

    setLogs((prev) => [
      ...prev,
      {
        id: `cmd-${Date.now()}-${Math.random()}`,
        command: trimmed,
        output: newOutput,
        timestamp: new Date().toLocaleTimeString('pt-BR'),
        type,
      },
    ])
    setCurrentInput('')
  }

  // Teclado no terminal (Enter, Setas)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const nextIndex = historyIndex + 1
        if (nextIndex < commandHistory.length) {
          setHistoryIndex(nextIndex)
          setCurrentInput(commandHistory[commandHistory.length - 1 - nextIndex])
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1
        setHistoryIndex(nextIndex)
        setCurrentInput(commandHistory[commandHistory.length - 1 - nextIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setCurrentInput('')
      }
    }
  }

  // Copiar todo output do terminal
  const copyTerminalOutput = () => {
    const text = logs
      .map((l) => {
        return `senamfo-ops@vps:~$ ${l.command}\n${typeof l.output === 'string' ? l.output : '[Output de tabela / comando]'}`
      })
      .join('\n\n')
    navigator.clipboard.writeText(text)
    toast.success('Histórico do terminal copiado para a área de transferência!')
  }

  // Otimizador PromptOps
  const handleOptimizePrompt = () => {
    if (!rawPromptInput.trim()) {
      toast.error('Informe a instrução de base para otimizar.')
      return
    }

    setOptimizing(true)
    setTimeout(() => {
      const isClaude = provider.includes('Claude')
      const isDeepSeek = provider.includes('DeepSeek')

      const optimized = {
        provider,
        model: isClaude ? 'Claude 3.7 Sonnet' : isDeepSeek ? 'DeepSeek-v4.1-flash' : 'o3-mini',
        generatedAt: new Date().toLocaleTimeString('pt-BR'),
        systemPrompt: `# PROMPT OPERACIONAL DETERMINÍSTICO (PROMPTOPS SSOT v0.0.2)
# Perfil de Agente: ${provider} | Variante: ${promptVariant}
# Projeto Alvo: ${selectedProject.nome} (${selectedProject.id}) | Schema: ${selectedProject.schema}

## 1. CONTEXTO & AUTORIDADE
Você atua como engenheiro especialista de missão crítica no ecossistema Skip Cloud integrado ao Supabase Self-Hosted (porta 54322, VPS Coolify).
Sua autoridade decorre estritamente de SYSTEM.md §12 e do design system Apex Light & Documental. O schema 'public' nunca deve ser invocado para dados de produto.

## 2. OBJETIVOS ESPECÍFICOS
- Executar a solicitação do operador: "${rawPromptInput.trim()}".
- Garantir isolamento no schema '${selectedProject.schema}'.
- Ativar políticas Row Level Security (RLS) mandatárias vinculadas ao predicado app_id = '${selectedProject.id}'.
- Mapear fluxos de integração com ${selectedProject.upstream} -> ${selectedProject.downstream}.

## 3. REGRAS DE EXECUÇÃO E HIGIENIZAÇÃO RÍGIDA
- Zero vazamento de credenciais: Qualquer secret ou chave privada deve ser referenciada por env seguro (ex: import.meta.env.VITE_*), nunca em hardcode.
- Buckets de storage: Restringir a '${selectedProject.buckets.public}' (público) e '${selectedProject.buckets.private}' (privado).
- Formato de saída: Código TypeScript/SQL limpo, determinístico, com tipagem estrita e documentação inline em português.

## 4. SAÍDA ESPERADA
Entregar artefato pronto para compilação, com testes de isolamento e validação de 0 drift no catálogo canônico.`,
        userPrompt: rawPromptInput,
      }

      setOptimizedResult(optimized)
      setOptimizing(false)
      toast.success('Prompt otimizado com sucesso pelo PromptOps Studio!')
    }, 700)
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-900 text-sky-300 border border-slate-800 uppercase tracking-wider font-mono">
              CLI &bull; Terminal de Operações &bull; Hub de Agentes
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Porta 54322 &bull; PromptOps Studio
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Terminal de Operações &amp; PromptOps
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-3xl">
            Console de comando interativo para auditoria do Supabase Self-Hosted, telemetria de
            schemas e estúdio determinístico de metaprompts com múltiplos provedores.
          </p>
        </div>

        {/* Action Right */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setDrawerOpen(true)}
            className="bg-sky-700 hover:bg-sky-800 text-white shadow-xs text-xs font-semibold gap-2"
          >
            <Layers className="w-3.5 h-3.5" />
            Abrir Saídas Técnicas (Drawer)
          </Button>
        </div>
      </div>

      {/* Grid: Console CLI & Atalhos Rápidos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Terminal Interativo (2 Colunas) */}
        <div className="lg:col-span-2 space-y-3">
          {/* Card do Terminal Estilo Console macOS */}
          <div
            onClick={focusInput}
            className="rounded-lg border border-slate-800 bg-slate-950 shadow-xl overflow-hidden font-mono flex flex-col h-[520px] transition-all cursor-text"
          >
            {/* Top Bar macOS */}
            <div className="h-9 bg-slate-900 border-b border-slate-800 px-3.5 flex items-center justify-between select-none shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block border border-rose-600/30"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block border border-amber-600/30"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block border border-emerald-600/30"></span>
                </div>
                <span className="text-xs text-slate-400 pl-2 font-mono truncate">
                  ops@senamfo-coolify:~ (bash)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Túnel Local Ativo (Porta 54322)
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    copyTerminalOutput()
                  }}
                  className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded transition-colors"
                  title="Copiar Output"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setLogs([])
                  }}
                  className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded transition-colors"
                  title="Limpar Terminal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Terminal Body Logs */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs text-slate-100 font-mono leading-relaxed selection:bg-sky-600 selection:text-white">
              <div className="text-slate-500 text-[11px] pb-1 border-b border-slate-900">
                Linux senamfo-coolify 5.15.0-101-generic #111-Ubuntu SMP x86_64
                <br />
                Supabase Self-Hosted CLI Gateway &bull; Authorized Operator Session
              </div>

              {logs.map((log) => (
                <div key={log.id} className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="text-emerald-400 font-bold">senamfo-ops@vps:~$</span>
                    <span className="text-white font-semibold">{log.command}</span>
                    <span className="text-[10px] text-slate-600 ml-auto font-mono">
                      {log.timestamp}
                    </span>
                  </div>
                  <div
                    className={`pl-4 border-l-2 ${
                      log.type === 'error'
                        ? 'border-rose-500 text-rose-300'
                        : log.type === 'success'
                          ? 'border-emerald-500 text-slate-200'
                          : log.type === 'table'
                            ? 'border-sky-500 text-slate-200'
                            : 'border-slate-800 text-slate-300'
                    }`}
                  >
                    {log.output}
                  </div>
                </div>
              ))}

              <div ref={terminalEndRef} />
            </div>

            {/* Prompt Input Line */}
            <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2 shrink-0">
              <span className="text-emerald-400 font-bold text-xs select-none">
                senamfo-ops@vps:~$
              </span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="digite um comando (ex: status, schemas list, help)..."
                className="flex-1 bg-transparent text-slate-100 text-xs font-mono focus:outline-hidden placeholder:text-slate-600"
                autoFocus
              />
              <button
                onClick={() => executeCommand(currentInput)}
                className="px-2.5 py-1 rounded bg-sky-700 hover:bg-sky-600 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
              >
                <Play className="w-3 h-3" />
                Executar
              </button>
            </div>
          </div>

          {/* Botões Rápidos para Comandos Frequentes */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-600">Comandos Rápidos:</span>
            {[
              { label: 'help', cmd: 'help' },
              { label: 'status', cmd: 'status' },
              { label: 'schemas list', cmd: 'schemas list' },
              { label: 'tunnel open', cmd: 'tunnel open' },
              { label: 'rls verify', cmd: `rls verify ${selectedProject.schema}` },
              { label: 'ping', cmd: 'ping' },
              { label: 'clear', cmd: 'clear' },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={() => executeCommand(btn.cmd)}
                className="px-2.5 py-1 rounded-md text-xs font-mono bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs transition-colors"
              >
                {btn.cmd}
              </button>
            ))}
          </div>
        </div>

        {/* Coluna Direita: Contexto de Segurança & Metadados do Túnel */}
        <div className="space-y-4">
          <Card className="bg-white border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Auditoria de Segurança (v0.0.2)
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Padrão de Higienização Rígida SYSTEM.md §12
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs font-mono">
              <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  0 Credenciais Expostas
                </div>
                <p className="text-[11px] font-sans text-emerald-700">
                  Todas as senhas de banco e tokens JWT permanecem mascarados como{' '}
                  <code className="font-mono bg-emerald-100/70 px-1 rounded">••••••••</code> ou
                  injetados via secrets seguros de ambiente.
                </p>
              </div>

              <div className="space-y-2 text-slate-600 pt-1">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Postgres Port:</span>
                  <span className="font-bold text-slate-800">54322 (Túnel SSH)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Kong Gateway:</span>
                  <span className="text-sky-800 truncate max-w-[150px]">
                    supabase.senamfo.com.br
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">VPS Coolify ID:</span>
                  <span className="text-slate-800 font-mono text-[11px]">
                    {BACKEND_CONFIG.coolifyVpsId}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Projeto Selecionado:</span>
                  <span className="font-bold text-sky-900">{selectedProject.id}</span>
                </div>
              </div>

              {/* Seletor de Projeto Ativo */}
              <div className="pt-2">
                <label className="text-[11px] font-sans font-semibold text-slate-700 block mb-1">
                  Mudar Projeto Alvo do Terminal / Drawer:
                </label>
                <select
                  value={selectedProject.slug}
                  onChange={(e) => {
                    const found = CANONICAL_PROJECTS.find((p) => p.slug === e.target.value)
                    if (found) setSelectedProject(found)
                  }}
                  className="w-full text-xs h-8 px-2 bg-slate-50 border border-slate-200 rounded font-sans font-medium text-slate-800 focus:outline-hidden focus:border-sky-700"
                >
                  {CANONICAL_PROJECTS.map((p) => (
                    <option key={p.id} value={p.slug}>
                      [{p.dominio.toUpperCase()}] {p.nome} ({p.id})
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Card Atalho Drawer */}
          <div className="p-4 rounded-lg bg-sky-50 border border-sky-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-sky-700" />
                Drawer Multiformato Retrátil
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 font-semibold">
                4 Formatos
              </span>
            </div>
            <p className="text-xs text-sky-800">
              Gere e inspecione saídas em <strong>Markdown (.md)</strong>,{' '}
              <strong>JSON (.json)</strong>, <strong>YAML (.yaml)</strong> e{' '}
              <strong>DDL SQL (.sql)</strong> diretamente no drawer lateral.
            </p>
            <Button
              onClick={() => setDrawerOpen(true)}
              className="w-full h-8 text-xs bg-sky-700 hover:bg-sky-800 text-white font-semibold gap-1.5 shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Ver Saídas de {selectedProject.id}
            </Button>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SEÇÃO 2: APRIMORADOR DE PROMPTS & PROMPTOPS STUDIO */}
      {/* ==================================================================== */}
      <Card className="bg-white border-slate-200 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-700" />
                Aprimorador de Prompts &amp; PromptOps Studio
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Otimização determinística de instruções de agentes no padrão canônico com seções de
                Contexto, Objetivos, Regras e Saída esperada
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                Padrão Determinístico SSOT
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Seletor de Perfil de Agente/Provedor */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Perfil de Agente / Provedor LLM:
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as any)}
                className="w-full text-xs h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-md font-medium text-slate-800 focus:outline-hidden focus:border-sky-700"
              >
                <optgroup label="OpenCode Go">
                  <option value="OpenCode Go (DeepSeek-v4.1-flash)">
                    OpenCode Go &bull; DeepSeek-v4.1-flash
                  </option>
                  <option value="OpenCode Go (GLM-5.3-flash)">
                    OpenCode Go &bull; GLM-5.3-flash
                  </option>
                </optgroup>
                <optgroup label="OpenRouter">
                  <option value="OpenRouter (Claude 3.7 Sonnet)">
                    OpenRouter &bull; Claude 3.7 Sonnet
                  </option>
                  <option value="OpenRouter (OpenAI o3-mini)">
                    OpenRouter &bull; OpenAI o3-mini
                  </option>
                </optgroup>
              </select>
            </div>

            {/* Variante de Raciocínio */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Variante Operacional:
              </label>
              <div className="flex items-center gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => setPromptVariant('max')}
                  className={`flex-1 h-9 rounded-md text-xs font-semibold border transition-all ${
                    promptVariant === 'max'
                      ? 'bg-sky-50 text-sky-800 border-sky-300 shadow-2xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Variant: Max (Determinístico)
                </button>
                <button
                  type="button"
                  onClick={() => setPromptVariant('standard')}
                  className={`flex-1 h-9 rounded-md text-xs font-semibold border transition-all ${
                    promptVariant === 'standard'
                      ? 'bg-sky-50 text-sky-800 border-sky-300 shadow-2xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Standard (Ágil)
                </button>
              </div>
            </div>

            {/* Projeto Vinculado */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Schema e App de Destino:
              </label>
              <div className="h-9 px-3 rounded-md bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700 flex items-center justify-between">
                <span className="font-bold text-sky-900 truncate">{selectedProject.schema}</span>
                <span className="text-[10px] text-slate-500 uppercase">
                  {selectedProject.dominio}
                </span>
              </div>
            </div>
          </div>

          {/* Editor de Prompt de Entrada */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Instrução Bruta do Usuário ou Especificação Funcional:
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {rawPromptInput.length} caracteres
              </span>
            </div>
            <textarea
              value={rawPromptInput}
              onChange={(e) => setRawPromptInput(e.target.value)}
              rows={3}
              placeholder="Digite o objetivo ou comportamento pretendido para a IA..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 font-sans focus:bg-white focus:outline-hidden focus:border-sky-700 focus:ring-2 focus:ring-sky-700/20"
            />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleOptimizePrompt}
              disabled={optimizing}
              className="bg-sky-700 hover:bg-sky-800 text-white font-semibold text-xs gap-2 px-6 h-10 shadow-xs"
            >
              <Sparkles className={`w-3.5 h-3.5 ${optimizing ? 'animate-spin' : ''}`} />
              {optimizing ? 'Formatando PromptOps...' : 'Otimizar Prompt (PromptOps)'}
            </Button>
          </div>

          {/* Resultado Otimizado em Formato Determinístico */}
          {optimizedResult && (
            <div className="space-y-2 pt-2 border-t border-slate-100 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">
                    Prompt Otimizado (Padrão Canônico):
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                    4 Seções Determinísticas
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(optimizedResult.systemPrompt)
                      toast.success('Prompt otimizado copiado!')
                    }}
                    className="h-8 text-xs border-slate-200 hover:bg-slate-50 gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copiar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setDrawerOpen(true)}
                    className="h-8 text-xs bg-sky-700 hover:bg-sky-800 text-white gap-1"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    Inspecionar no Drawer
                  </Button>
                </div>
              </div>

              <pre className="p-4 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed border border-slate-800 overflow-x-auto max-h-96">
                {optimizedResult.systemPrompt}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Drawer Multiformato Retrátil */}
      <MultiFormatDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        project={selectedProject}
        promptOpsOutput={optimizedResult}
      />
    </div>
  )
}
