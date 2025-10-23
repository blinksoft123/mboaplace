
    import { createClient } from '@supabase/supabase-js';

    const supabaseUrl = '__SUPABASE_URL__';
    const supabaseAnonKey = '__SUPABASE_ANON_KEY__';

    export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  