# 03_PADRAO_VISUAL_UIUX_E_ENTRADAS_SAIDAS.md

# Diretrizes de UI/UX, Design Tokens e Esteira de Entradas e Saídas

## 1. Padrão Visual Obrigatório (Apex Light & Documental)

Em conformidade com `~/SYSTEM.md` §2.6.3 e o design system do SmartHub (`tools/18_frontend_ui_ux/`):

- **Tema Base:** **Apex Light** (oficial para consoles, dashboards e apps operacionais).
- **Tema Secundário:** **Documental** (específico para visualizadores de laudos, relatórios fiscais e dossiês de clientes).
- **Paleta de Cores Funcionais (Tailwind CSS):**
  - Background Geral: `bg-slate-50` (`#F8FAFC`) e superfícies `bg-white` (`#FFFFFF`).
  - Painéis / Cards: Borda sutil `border-slate-200` (`#E2E8F0`) com sombra suave `shadow-xs`.
  - Tipografia: Texto principal `text-slate-900` (`#0F172A`) e secundário `text-slate-500` (`#64748B`).
  - Acentos Primários: Azul Corporativo `bg-sky-700` (`#0369A1`) com hover `bg-sky-800`.
  - Badges Semânticos:
    - Live / Validado: `bg-emerald-50 text-emerald-700 border-emerald-200`
    - Protótipo / WIP: `bg-amber-50 text-amber-700 border-amber-200`
    - Drift / Erro: `bg-rose-50 text-rose-700 border-rose-200`
- **Componentes Estruturais:**
  - Sidebar retrátil com navegação hierárquica por domínio.
  - Header fixo com breadcrumbs, seletor de ambiente e status da conexão com Supabase.
  - Tabela densa de inventário com busca rápida em tempo real e filtros múltiplos.

---

## 2. Esteira de Replicabilidade: Entradas e Saídas

### Fluxo de Intake (Entradas do Projeto)

Todo novo projeto configurado ou prototipado pelo template deve declarar:

1. **Identificação:** Nome de produto, domínio pretendido (`mfo`, `legal`, `agent`, `comm`, `tpl`) e objetivo funcional.
2. **Schema Target:** Nome do schema segregado no Supabase (`skip_<slug>`).
3. **Contrato de Membros:** Políticas RLS baseadas em `app_id` e roles autenticadas do GoTrue.
4. **Armazenamento:** Nomes dos buckets de storage obrigatórios (`<schema>-public` e `<schema>-private`).

### Fluxo de Export e Promoção (Saídas para Produção)

Ao concluir o ciclo no Skip Cloud, a esteira de saída gera:

1. **Manifesto Declarativo:** Arquivo YAML para `glob_00_skip/backends/supabase/apps/<slug>.yaml`.
2. **Migration SQL:** Script DDL com `CREATE SCHEMA IF NOT EXISTS`, criação de tabelas e ativação estrita de RLS.
3. **Checklist de Promoção:**
   - Remoção completa de mocks e credenciais de builder.
   - Configuração das variáveis no Coolify (`cprz78e8mogdugpyjwpe2maw`).
   - Apontamento de rota produtiva para `https://<id>.mfotrust.com`.
   - Execução de `make validate` no `glob_00_skip`.
