import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hihzmjqkszcxxdrhnqpy.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpaHptanFrc3pjeHhkcmhucXB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzMjc1ODMsImV4cCI6MjA4MzkwMzU4M30.gKVFx9ZUO8rjtrPDkcUBRToexX2IlmkwZY2S3IgwNkY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
