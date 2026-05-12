import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'https://gitjchzvmskzenjlyvkc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpdGpjaHp2bXNremVuamx5dmtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0OTkwMzgsImV4cCI6MjA5NDA3NTAzOH0.5tdFA0MRXpdU3bE7mamU4Jh7Yy4tyFchO-3Jlf0OgQA';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  }
});

