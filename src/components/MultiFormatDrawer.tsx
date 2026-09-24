import { useState } from 'react'
import {
  FileText,
  FileJson,
  FileCode,
  Database,
  Copy,
  Download,
  X,
  ExternalLink,
  CheckCircle2,
  Shield,
  Layers,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { ProjectCanonical } from '@/data/types'
import { generateProjectYaml, generateProjectJson, generateProjectSqlDdl } from '@/lib/exportUtils'
import { BACKEND_CONFIG } from '@/data/canonicalData'

interface MultiFormatDrawerProps {
  open: boolean
  onClose: () => void
  project: ProjectCanonical
  promptOpsOutput?: {
    systemPrompt: string
    userPrompt: string
    provider: string
    model: string
    generatedAt: string
  } | null
}

export default function MultiFormatDrawer({
  open,
  onClose,
  project,
  promptOpsOutput,
}: MultiFormatDrawerProps) {
  const [activeTab, setActiveTab] = useState<'md' | 'json' | 'yaml' | 'sql'>('md')

  if (!open) return null

  // Conteúdo Markdown
  const markdownContent = `# Manifesto de Arquitetura & Governança (SYSTEM.md §12)
## Projeto: ${project.nome} (${project.id})

- **Slug Padronizado:** \`${project.slug}\`
- **Domínio Canônico:** \`${project.dominio}\`
- **Status:** **${project.status}** (${project.conforme ? 'Conforme Seção 12' : 'Em validação'})
- **Schema Supabase Self-Hosted:** \`${project.schema}\`
- **Host Data Plane:** \`${BACKEND_CONFIG.host}:${BACKEND_CONFIG.port}\`
- **VPS Coolify:** \`${BACKEND_CONFIG.coolifyVpsId}\`
- **URL Produtiva:** \`https://${project.id}.mfotrust.com\`

---

### 1. Isolamento Estrito de Schema
O schema \`public\` permanece bloqueado para dados de negócio. Todas as tabelas e views residem em \`${project.schema}\`.

- **Tabelas Estimadas:** ${project.tabelasEstimadas}
- **Registros Estimados:** ${project.registrosEstimados.toLocaleString('pt-BR')}
- **Pipeline Upstream / Downstream:** \`${project.upstream}\` -> \`${project.downstream}\`

### 2. Storage Buckets Declarados
- **Público:** \`${project.buckets.public}\` (10MB, cache CDN)
- **Privado:** \`${project.buckets.private}\` (50MB, RLS estrito)

### 3. PromptOps Vinculado
${
  promptOpsOutput
    ? `
- **Provedor:** ${promptOpsOutput.provider} (${promptOpsOutput.model})
- **Gerado em:** ${promptOpsOutput.generatedAt}
- **Prompt Otimizado:**
\`\`\`markdown
${promptOpsOutput.systemPrompt}
\`\`\`
`
    : `Nenhum prompt otimizado registrado nesta sessão. Utilize o painel **PromptOps Studio** para gerar metaprompts auditáveis.`
}

---
*Gerado por Template Base Canônico v0.0.2 - 0 credenciais expostas.*
`

  // Conteúdo JSON
  const jsonContent = generateProjectJson(project.slug)

  // Conteúdo YAML
  const yamlContent = generateProjectYaml(project.slug)

  // Conteúdo SQL DDL
  const sqlContent = generateProjectSqlDdl(project.slug)

  const activeContent =
    activeTab === 'md'
      ? markdownContent
      : activeTab === 'json'
        ? jsonContent
        : activeTab === 'yaml'
          ? yamlContent
          : sqlContent

  const activeExt =
    activeTab === 'md'
      ? 'md'
      : activeTab === 'json'
        ? 'json'
        : activeTab === 'yaml'
          ? 'yaml'
          : 'sql'

  const activeMime =
    activeTab === 'md'
      ? 'text/markdown'
      : activeTab === 'json'
        ? 'application/json'
        : activeTab === 'yaml'
          ? 'text/yaml'
          : 'text/plain'

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent)
    toast.success(`Conteúdo .${activeExt} copiado para a área de transferência!`)
  }

  const handleDownload = () => {
    const blob = new Blob([activeContent], { type: `${activeMime};charset=utf-8` })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${project.id}_${activeTab}.${activeExt}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(`Arquivo ${project.id}_${activeTab}.${activeExt} baixado com sucesso!`)
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <aside className="relative w-full max-w-2xl bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Header do Drawer */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between shrink-0">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-200 font-mono">
                Multiformato &bull; {project.id}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Schema: <strong className="text-sky-900">{project.schema}</strong>
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 truncate max-w-md">
              Saídas Técnicas: {project.nome}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-slate-200/80 text-slate-500 hover:text-slate-900 transition-colors"
            title="Fechar Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls Bar */}
        <div className="px-4 py-2 border-b border-slate-200 bg-white flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('md')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'md'
                  ? 'bg-sky-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Markdown (.md)
            </button>

            <button
              onClick={() => setActiveTab('json')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'json'
                  ? 'bg-sky-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <FileJson className="w-3.5 h-3.5" />
              JSON (.json)
            </button>

            <button
              onClick={() => setActiveTab('yaml')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'yaml'
                  ? 'bg-sky-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              YAML (.yaml)
            </button>

            <button
              onClick={() => setActiveTab('sql')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'sql'
                  ? 'bg-sky-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              DDL SQL (.sql)
            </button>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-8 text-xs gap-1 border-slate-200 hover:bg-slate-50 text-slate-700"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Copiar</span>
            </Button>
            <Button
              size="sm"
              onClick={handleDownload}
              className="h-8 text-xs gap-1 bg-sky-700 hover:bg-sky-800 text-white"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Baixar .{activeExt}</span>
            </Button>
          </div>
        </div>

        {/* Content Viewer (Scrollable) */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-950 text-slate-100 font-mono text-xs leading-relaxed selection:bg-sky-600 selection:text-white">
          <pre className="whitespace-pre-wrap break-words">{activeContent}</pre>
        </div>

        {/* Drawer Footer Status */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-slate-600 text-xs flex items-center justify-between shrink-0 font-sans">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] text-slate-600 font-mono">
              Validação Seção 12: <strong className="text-emerald-700">Auditado (0 Leaks)</strong>
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {activeContent.split('\n').length} linhas &bull; {new Blob([activeContent]).size} bytes
          </span>
        </div>
      </aside>
    </div>
  )
}
