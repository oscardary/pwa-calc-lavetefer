/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
    // Aquí puedes agregar más variables si las usas
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  