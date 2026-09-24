/* Main App Component - Configuração de rotas canônicas e providers */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import Inventario from './pages/Inventario'
import Conectores from './pages/Conectores'
import Esteira from './pages/Esteira'
import Biblioteca from './pages/Biblioteca'
import TerminalOps from './pages/TerminalOps'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'

const App = () => (
  <BrowserRouter>
    <TooltipProvider delayDuration={150}>
      <Toaster />
      <Sonner position="top-right" richColors />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/conectores" element={<Conectores />} />
          <Route path="/terminal" element={<TerminalOps />} />
          <Route path="/esteira" element={<Esteira />} />
          <Route path="/biblioteca" element={<Biblioteca />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
