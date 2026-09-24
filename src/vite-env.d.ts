/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_HOST?: string
  readonly VITE_SUPABASE_PORT?: string
  readonly VITE_SUPABASE_DB?: string
  readonly VITE_SUPABASE_USER?: string
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  readonly VITE_DB_PASSWORD?: string
  readonly VITE_COOLIFY_VPS_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
