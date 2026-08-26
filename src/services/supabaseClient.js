import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://zzuwoldawwrehqrceeto.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6dXdvbGRhd3dyZWhxcmNlZXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MzcwODMsImV4cCI6MjEwMzMxMzA4M30.PBGA6uoGuT4srclNw3dasBOKfsrafaKXBNNH6a_RXtY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
