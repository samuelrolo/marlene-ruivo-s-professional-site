import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hihzmjqkszcxxdrhnqpy.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpaHptanFrc3pjeHhkcmhucXB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3ODU4MTIsImV4cCI6MjA1MjM2MTgxMn0.z3HQs5_zYNQQF2s7gZvGrP6FrQHXQSdNw_PREejl1y4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
