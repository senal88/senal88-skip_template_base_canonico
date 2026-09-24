# 01_ARQUITETURA_E_BACKEND_CANONICO.md

# SSOT: Arquitetura, Conexões e Ambientes (Dev / Prod / VPS / GitHub)

## 1. Regra Suprema de Backend (SYSTEM.md §12)

Para todo e qualquer projeto desenvolvido ou prototipado no Skip com destino aos ecossistemas `~/Projects`:

- **Stack Fixo:** Frontend concebido e exportado pelo Skip Cloud e publicado em `https://<id>.mfotrust.com`.
- **Backend Oficial Único:** Supabase Self-Hosted hospedado no Coolify da VPS (`cprz78e8mogdugpyjwpe2maw`).
- **Segregação Obrigatória:** Cada aplicação possui seu próprio schema isolado (`skip_<slug>`). O schema `public` nunca é utilizado para dados de produto.
- **Segurança e RLS:** Row Level Security (RLS) mandatório com membership por app; chave pública (`anon`) restrita ao browser; chave de servidor somente em server-side/BFF.
- **Buckets de Armazenamento:** Criados no padrão `<schema>-public` e `<schema>-private`.
- **Eliminação de Legados:** Supabase Cloud Free permanece congelado e em eliminação. Directus + PostgreSQL atua exclusivamente como MDM, backoffice humano e console de dados complexos/fiduciários.

---

## 2. Parâmetros de Conexão e Redes

### Produção / Externo (Skip Cloud -> VPS Coolify)

- **Host:** `supabase.senamfo.com.br`
- **Port:** `54322`
- **Database:** `postgres`
- **Username:** `postgres`
- **Password:** `••••••••` _(injetada via secret seguro de ambiente / VITE_DB_PASSWORD)_
- **API URL (Kong):** `https://supabase.senamfo.com.br`
- **SSL Mode:** `Skip Verification` (ou desabilitado conforme conector)
- **Retrieve All Schemas:** `Yes`
- **Chave Anon (Browser):** `••••••••` _(lida exclusivamente via `import.meta.env.VITE_SUPABASE_ANON_KEY`)_
- **Chave de Servidor / BFF:** `••••••••` _(restrita exclusivamente ao servidor/BFF via secret seguro; nunca exposta ao cliente)_

### Desenvolvimento / Local

- **URL Local:** `http://127.0.0.1:54321` (ou túnel via `54322`)
- **Túnel SSH / Admin Ops:** Executado via `glob_00_infra/scripts/ops/supabase_self_hosted_agent_ops.py tunnel`

---

## 3. Repositórios GitHub e Autoridade

- **Governança Global (SSOT):** `git@github.com:senal88/glob_00_prompts.git` (em `~/Projects/governanca/glob_00_prompts`)
- **Catálogo de Contratos e Pipeline Skip:** `git@github.com:senal88/glob_00_skip.git` (em `~/Projects/skip/glob_00_skip`)
- **Infraestrutura e Manifests Coolify:** `git@github.com:senal88/glob_00_infra.git` (em `~/Projects/infra/glob_00_infra`)
- **SmartHub (BFF e Componentes):** `git@github.com:senal88/glob_00_smarthub.git` (em `~/Projects/smarthub/glob_00_smarthub`)
- **Projetos de Domínio:** `proj_00_*` e `glob_00_*` seguem Conventional Commits, branch isolada, testes e sem credenciais no código.
