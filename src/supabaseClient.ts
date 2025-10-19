// supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://uwclseatqvcdjmgoyuae.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3Y2xzZWF0cXZjZGptZ295dWFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NTI4MDYsImV4cCI6MjA3NjMyODgwNn0.mb6FxWJgjvc2X-NQtBj5iOVtT5hBuxBFO80b0Fqhl3o';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
