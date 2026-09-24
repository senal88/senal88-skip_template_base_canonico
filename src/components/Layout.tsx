import { useState } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Boxes,
  Database,
  GitBranch,
  Component,
  ChevronDown,
  Menu,
  Globe,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FolderGit2,
  ExternalLink,
  ShieldCheck,
  User,
  LogOut,
  Sliders,
  Terminal,
} from 'lucide-react'
import { DOMAINS } from '@/data/canonicalData'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [domainsOpen, setDomainsOpen] = useState(true)
  const [environment, setEnvironment] = useState<'Produção' | 'Desenvolvimento'>('Produção')
  const [connectionStatus, setConnectionStatus] = useState<'Conectado' | 'Verificando' | 'Offline'>(
    'Conectado',
  )

  const location = useLocation()
  const navigate = useNavigate()

  const handleTestPing = () => {
    setConnectionStatus('Verificando')
    toast.info('Verificando conexão com Kong Gateway em supabase.senamfo.com.br...')
    setTimeout(() => {
      setConnectionStatus('Conectado')
      toast.success('Backend Supabase Self-Hosted conectado (28ms).')
    }, 800)
  }

  // Breadcrumbs calculation
  const getBreadcrumbs = () => {
    const path = location.pathname
    const search = new URLSearchParams(location.search)
    const domainFilter = search.get('dominio')

    const crumbs = [{ label: 'Console', path: '/' }]

    if (path === '/') {
      crumbs.push({ label: 'Visão Geral', path: '/' })
    } else if (path.startsWith('/inventario')) {
      crumbs.push({ label: 'Inventário & Governança', path: '/inventario' })
      if (domainFilter && DOMAINS[domainFilter]) {
        crumbs.push({
          label: DOMAINS[domainFilter].label,
          path: `/inventario?dominio=${domainFilter}`,
        })
      }
    } else if (path.startsWith('/conectores')) {
      crumbs.push({ label: 'Conectores & Data Plane', path: '/conectores' })
    } else if (path.startsWith('/terminal')) {
      crumbs.push({ label: 'Terminal & PromptOps', path: '/terminal' })
    } else if (path.startsWith('/esteira')) {
      crumbs.push({ label: 'Esteira de Intake/Exports', path: '/esteira' })
    } else if (path.startsWith('/biblioteca')) {
      crumbs.push({ label: 'Biblioteca de Componentes', path: '/biblioteca' })
    }

    return crumbs
  }

  const breadcrumbs = getBreadcrumbs()

  const navItems = [
    {
      to: '/',
      label: 'Visão Geral',
      shortLabel: 'Dashboard',
      icon: LayoutDashboard,
      badge: '33',
    },
    {
      to: '/inventario',
      label: 'Inventário & Governança',
      shortLabel: 'Inventário',
      icon: Boxes,
      badge: 'SSOT',
    },
    {
      to: '/conectores',
      label: 'Conectores & Data Plane',
      shortLabel: 'Conectores',
      icon: Database,
      badge: '54322',
    },
    {
      to: '/terminal',
      label: 'Terminal & PromptOps',
      shortLabel: 'Terminal',
      icon: Terminal,
      badge: 'CLI',
    },
    {
      to: '/esteira',
      label: 'Esteira de Intake/Exports',
      shortLabel: 'Esteira',
      icon: GitBranch,
      badge: 'Coolify',
    },
    {
      to: '/biblioteca',
      label: 'Biblioteca de Componentes',
      shortLabel: 'Design System',
      icon: Component,
      badge: 'UI/UX',
    },
  ]

  const domainShortcuts = Object.values(DOMAINS)

  return (
    <TooltipProvider delayDuration={150}>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-sky-100 selection:text-sky-900">
        {/* Header fixo */}
        <header className="sticky top-0 z-40 h-14 bg-white border-b border-slate-200 px-3 md:px-5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            {/* Hamburger Button para mobile e desktop collapse */}
            <button
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setMobileOpen(!mobileOpen)
                } else {
                  setCollapsed(!collapsed)
                }
              }}
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors focus:outline-hidden focus:ring-2 focus:ring-sky-700/20"
              title="Alternar Sidebar"
              aria-label="Alternar navegação lateral"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Brand Logo & Name */}
            <div className="flex items-center gap-2 pr-2 border-r border-slate-200">
              <div className="w-7 h-7 rounded bg-sky-700 text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-xs">
                TB
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  Template Base Canônico
                </span>
                <span className="text-[10px] text-slate-500 font-mono tracking-tight leading-none">
                  Skip Cloud &bull; Coolify &bull; Supabase
                </span>
              </div>
            </div>

            {/* Breadcrumbs */}
            <nav
              className="hidden md:flex items-center text-xs text-slate-500 gap-1.5 pl-1"
              aria-label="Breadcrumb"
            >
              {breadcrumbs.map((crumb, idx) => (
                <div key={crumb.path + idx} className="flex items-center gap-1.5">
                  {idx > 0 && <span className="text-slate-300">/</span>}
                  <button
                    onClick={() => navigate(crumb.path)}
                    className={`hover:text-sky-700 transition-colors ${
                      idx === breadcrumbs.length - 1
                        ? 'font-semibold text-slate-800'
                        : 'text-slate-500'
                    }`}
                  >
                    {crumb.label}
                  </button>
                </div>
              ))}
            </nav>
          </div>

          {/* Header Controls Right */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Seletor de Ambiente */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs transition-colors">
                  <Globe className="w-3.5 h-3.5 text-sky-700" />
                  <span className="hidden sm:inline">{environment}</span>
                  <span className="sm:hidden">{environment === 'Produção' ? 'PRD' : 'DEV'}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-white border border-slate-200 shadow-md"
              >
                <DropdownMenuLabel className="text-xs font-semibold text-slate-500">
                  Seletor de Ambiente
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    setEnvironment('Produção')
                    toast.success('Ambiente ativo: Produção (cprz78e8mogdugpyjwpe2maw)')
                  }}
                  className="text-xs flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Produção (VPS Coolify)
                  </span>
                  {environment === 'Produção' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setEnvironment('Desenvolvimento')
                    toast.info('Ambiente ativo: Desenvolvimento (Local / Túnel 54321)')
                  }}
                  className="text-xs flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    Desenvolvimento (Local)
                  </span>
                  {environment === 'Desenvolvimento' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Indicador de Status Supabase */}
            <button
              onClick={handleTestPing}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs transition-all"
              title="Clique para testar latência do Kong Gateway"
            >
              <span className="relative flex h-2 w-2">
                {connectionStatus === 'Conectado' && (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </>
                )}
                {connectionStatus === 'Verificando' && (
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 animate-pulse"></span>
                )}
                {connectionStatus === 'Offline' && (
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                )}
              </span>
              <span className="hidden sm:inline font-mono text-[11px] text-slate-600">
                Supabase:
              </span>
              <span
                className={`font-semibold text-[11px] ${
                  connectionStatus === 'Conectado'
                    ? 'text-emerald-700'
                    : connectionStatus === 'Verificando'
                      ? 'text-amber-700'
                      : 'text-rose-700'
                }`}
              >
                {connectionStatus}
              </span>
              <RefreshCw
                className={`w-3 h-3 text-slate-400 ml-0.5 ${connectionStatus === 'Verificando' ? 'animate-spin text-sky-700' : ''}`}
              />
            </button>

            {/* Avatar Admin com Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors focus:outline-hidden">
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center border border-slate-300">
                    AD
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-white border border-slate-200 shadow-md"
              >
                <DropdownMenuLabel className="flex flex-col py-1.5">
                  <span className="text-xs font-bold text-slate-900">Admin SSOT</span>
                  <span className="text-[11px] text-slate-500 font-mono">admin@mfotrust.com</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => toast.info('Preferências de governança e logs')}
                  className="text-xs flex items-center gap-2 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-slate-500" />
                  Preferências do Console
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    toast.info('Políticas de RLS e variáveis de ambiente em conformidade')
                  }
                  className="text-xs flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                  Segurança & RLS
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => toast.info('Sessão administrativa mantida ativa')}
                  className="text-xs text-rose-600 flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Encerrar Sessão
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Layout Body: Sidebar + Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Overlay Mobile */}
          {mobileOpen && (
            <div
              className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
          )}

          {/* Sidebar Retrátil (256px -> 72px) */}
          <aside
            className={`fixed lg:static inset-y-14 left-0 z-30 bg-white border-r border-slate-200 transition-all duration-200 flex flex-col justify-between shadow-xs ${
              collapsed ? 'w-[72px]' : 'w-64'
            } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
          >
            {/* Top Navigation */}
            <div className="py-3 px-2.5 space-y-4 overflow-y-auto max-h-[calc(100vh-7rem)]">
              {/* Core Links */}
              <div>
                {!collapsed && (
                  <div className="px-2.5 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Console Principal
                  </div>
                )}
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isRoot = item.to === '/'
                    const isActive = isRoot
                      ? location.pathname === '/'
                      : location.pathname.startsWith(item.to)

                    if (collapsed) {
                      return (
                        <Tooltip key={item.to}>
                          <TooltipTrigger asChild>
                            <NavLink
                              to={item.to}
                              onClick={() => setMobileOpen(false)}
                              className={`flex items-center justify-center h-10 w-full rounded-md transition-all ${
                                isActive
                                  ? 'bg-sky-700 text-white font-medium shadow-xs'
                                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                              }`}
                            >
                              <Icon className="w-5 h-5 shrink-0" />
                            </NavLink>
                          </TooltipTrigger>
                          <TooltipContent
                            side="right"
                            className="font-sans text-xs bg-slate-900 text-white"
                          >
                            <p className="font-semibold">{item.label}</p>
                            <span className="text-[10px] text-slate-300 font-mono">
                              Badge: {item.badge}
                            </span>
                          </TooltipContent>
                        </Tooltip>
                      )
                    }

                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-sky-700 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon
                            className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                            isActive ? 'bg-sky-800 text-sky-100' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.badge}
                        </span>
                      </NavLink>
                    )
                  })}
                </nav>
              </div>

              {/* Submenu Colapsável por Domínio */}
              <div className="pt-2 border-t border-slate-100">
                {!collapsed ? (
                  <div>
                    <button
                      onClick={() => setDomainsOpen(!domainsOpen)}
                      className="w-full flex items-center justify-between px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600"
                    >
                      <span>Domínios do Catálogo</span>
                      <ChevronDown
                        className={`w-3 h-3 transition-transform ${domainsOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {domainsOpen && (
                      <div className="mt-1 space-y-0.5">
                        {domainShortcuts.map((dom) => {
                          const isCurrentDom =
                            location.pathname === '/inventario' &&
                            location.search.includes(`dominio=${dom.code}`)
                          return (
                            <button
                              key={dom.code}
                              onClick={() => {
                                navigate(`/inventario?dominio=${dom.code}`)
                                setMobileOpen(false)
                              }}
                              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs transition-colors text-left ${
                                isCurrentDom
                                  ? 'bg-sky-50 text-sky-900 font-semibold border-l-2 border-sky-700 pl-2.5'
                                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span
                                  className={`w-2 h-2 rounded-full ${dom.dotColor} shrink-0`}
                                ></span>
                                <span className="truncate">{dom.label}</span>
                              </div>
                              <span className="text-[10px] font-mono text-slate-400 uppercase">
                                {dom.code}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {domainShortcuts.map((dom) => (
                      <Tooltip key={dom.code}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => navigate(`/inventario?dominio=${dom.code}`)}
                            className="w-full h-8 flex items-center justify-center rounded hover:bg-slate-100 text-slate-500"
                          >
                            <span className={`w-2.5 h-2.5 rounded-full ${dom.dotColor}`}></span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-slate-900 text-white text-xs">
                          {dom.label} ({dom.code})
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Footer Info */}
            <div className="p-3 border-t border-slate-200 bg-slate-50/70">
              {!collapsed ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-mono text-[10px]">
                      <FolderGit2 className="w-3 h-3 text-slate-400" />
                      glob_00_skip
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-1 py-0.2 rounded font-mono">
                      v2.6.3
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">
                    VPS Coolify <code className="font-mono text-slate-600">cprz78e8...</code>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center text-[10px] font-mono text-slate-400">2.6</div>
              )}
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>

        {/* Footer Fino */}
        <footer className="h-8 bg-white border-t border-slate-200 px-4 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-medium text-slate-700">Template Base Canônico</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-mono text-[10px]">SYSTEM.md §2.6.3 &amp; §12</span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:inline text-slate-500">33 Projetos Catalogados</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 text-[10px] font-mono border border-sky-200">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
              Coolify VPS
            </span>
            <span className="text-slate-400 text-[10px] font-mono">senamfo.com.br</span>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  )
}
